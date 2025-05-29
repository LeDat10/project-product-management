import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getPayment, postPayment } from "../services/orderServices";
import { TextInput } from "react-native-gesture-handler";
import { setConfig } from "../helper/setConfig";

interface InfoPayment {
  orderId: string;
  amount: number;
  hmac: string;
}

const Bank = ({ route }: any) => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [payment, setPayment] = useState<InfoPayment | null>(null);
  const { orderId } = route.params;
  const [loading, setLoading] = useState(false);
  const [money, setMoney] = useState<number | undefined>();

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const config = await setConfig();
      const response = await getPayment(orderId, config);
      if (response.data.code == 200) {
        // console.log(response.data.paymentData);
        setPayment(response.data.paymentData);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [orderId]);

  const handlePayment = async () => {
    if (!payment) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin thanh toán.");
      return;
    }
    setLoading(true);
    if (!money) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập số tiền cần thanh toán.",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
      setLoading(false);
      return;
    } else {
      try {
        const config = await setConfig();
        const response = await postPayment(
          payment["orderId"],
          money,
          payment["hmac"],
          config
        );
        if (response.data.code == 200) {
          Alert.alert("Thành công", response.data.message, [
            {
              text: "Tiếp tục mua sắm",
              onPress: () => navigation.navigate("product"),
            },
          ]);
        } else if (response.data.code == 400) {
          Alert.alert(
            "Thất bại",
            response.data.message + ". Vui lòng thử lại.",
            [
              {
                text: "OK",
                style: "cancel",
              },
            ],
            { cancelable: true }
          );
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.text}>Số tiền cần phải trả: </Text>
        <Text style={styles.amount}>{payment?.amount}$</Text>
      </View>

      <Text style={styles.text}>Nhập số tiền chuyển khoản: </Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số tiền"
        value={money ? String(money) : ""}
        onChangeText={(text) => setMoney(Number(text))}
        keyboardType="numeric"
        maxLength={25}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.textButton}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },

  amountContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },

  amount: {
    fontSize: 20,
    color: "red",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    marginTop: 5,
    marginHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },

  buttonContainer: {
    padding: 10,
    alignItems: "center",
  },

  button: {
    width: 356,
    height: 52,
    borderRadius: 25,
    backgroundColor: "#FFB13F",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    elevation: 5, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },

  textButton: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
});

export default Bank;
