import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

// type AccountScreenRouteProp = RouteProp<RootStackParamList, "account">;

// interface Props {
//   route: AccountScreenRouteProp;
// }

const Account = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const route: RouteProp<RootStackParamList, "user-info"> = useRoute();

  return (
    <ScrollView>
      <View style={styles.title1}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="account" size={30} color={"black"} />
        </View>

        <View style={styles.text}>
          <Text style={{ fontSize: 17, fontWeight: "600" }}>
            Chào mừng bạn đến với Tempi!!
          </Text>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => navigation.navigate("login")}
            >
              <Text style={{ color: "#257cda", fontSize: 15 }}>Đăng Nhập </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button1}
              onPress={() => navigation.navigate("register")}
            >
              <Text style={{ color: "#257cda", fontSize: 15 }}>
                Tạo tài khoản
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* đơn hàng  */}
      <View>
        <Text style={styles.text3}>Đơn hàng của tôi</Text>
      </View>
      <View style={styles.donhang}>
        <View style={styles.button2}>
          <TouchableOpacity style={styles.icon1}>
            <Ionicons name="wallet-outline" size={25} color="black" />
          </TouchableOpacity>
          <Text style={styles.text4}>Chờ thanh toán</Text>
        </View>

        <View style={styles.button2}>
          <TouchableOpacity style={styles.icon1}>
            <Fontisto name="checkbox-passive" size={25} color="black" />
          </TouchableOpacity>
          <Text style={styles.text4}>Đang xử lý</Text>
        </View>

        <View style={styles.button2}>
          <TouchableOpacity style={styles.icon1}>
            <MaterialIcons
              name="emoji-transportation"
              size={25}
              color="black"
            />
          </TouchableOpacity>
          <Text style={styles.text4}>Đang vận chuyển</Text>
        </View>

        <View style={styles.button2}>
          <TouchableOpacity style={styles.icon1}>
            <Fontisto name="checkbox-active" size={25} color="black" />
          </TouchableOpacity>
          <Text style={styles.text4}>Đã giao</Text>
        </View>

        <View style={styles.button2}>
          <TouchableOpacity style={styles.icon1}>
            <AntDesign name="reload1" size={25} color="black" />
          </TouchableOpacity>
          <Text style={styles.text4}>Đổi trả</Text>
        </View>
      </View>

      <Text>username: {route.params?.username ?? "Chưa có thông tin"} </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title1: {
    marginVertical: 10,
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "red",
  },

  icon: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 50,
    margin: 15,
  },

  text: {
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginVertical: 20,
    // borderWidth: 1,
    // borderColor: "red",
  },

  button: {
    flexDirection: "row",
    paddingRight: 20,
    // borderWidth: 1,
    // borderColor: "red",
  },

  button1: {
    borderWidth: 1,
    borderColor: "#257cda",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },

  text3: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 15,
  },

  donhang: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    // borderWidth: 1,
    // borderColor: "red",
  },

  button2: {
    alignItems: "center",
    width: 70,
    height: 70,
    // borderWidth: 1,
    // borderColor: "red",
  },

  text4: {
    flexWrap: "wrap",
    textAlign: "center",
    paddingTop: 5,
  },

  icon1: {
    backgroundColor: "#d3e1ee",
    padding: 8,
    borderRadius: 10,
  },
});

export default Account;
