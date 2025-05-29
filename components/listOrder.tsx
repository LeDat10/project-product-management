import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { setConfig } from "../helper/setConfig";
import { getListOrder } from "../services/orderServices";
import { FlatList } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface Order {
  _id: string;
  payment: boolean;
  status: string;
  totalPrice: number;
}

const ListOrder = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const config = await setConfig();
      const response = await getListOrder(config);
      if (response.data.code === 200) {
        // console.log(response.data.message);
        const order = response.data.orders;
        setOrders(order);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

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
    <SafeAreaView style={styles.cardContainer}>
      <View style={styles.container}>
        <FlatList
          data={orders}
          extraData={orders}
          keyExtractor={(item) => item._id}
          style={styles.Row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                (navigation as any).navigate("detail-list-order", {
                  orderId: item._id,
                })
              }
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>Mã đơn hàng: </Text>
                <Text style={styles.text}>{item._id}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Tổng hóa đơn: </Text>
                <Text style={styles.text}>{item.totalPrice}$</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Trạng thái: </Text>
                <Text style={styles.text}>
                  {item.status === "pending"
                    ? "Chờ xác nhận"
                    : item.status === "confirmed"
                    ? "Đã xác nhận"
                    : item.status === "delivered"
                    ? "Đã giao hàng"
                    : item.status === "cancelled"
                    ? "Đã hủy"
                    : item.status}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Thanh toán: </Text>
                <Text style={styles.text}>
                  {item.payment ? "Thành công" : "Không thành công"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.cartEmpty}>
              <Text style={styles.textCartEmpty}>Không có đơn hàng nào</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginBottom: 40,
  },

  container: {
    flex: 1,
  },

  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },

  Row: {
    marginHorizontal: 10,
    marginTop: 10,
  },

  text: {
    fontSize: 16,
    fontWeight: "500",
  },

  textContainer: {
    flexDirection: "row",
  },

  redText: {
    color: "red",
    fontSize: 16,
    fontWeight: "500",
  },

  cartEmpty: {
    alignItems: "center",
  },

  textCartEmpty: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default ListOrder;
