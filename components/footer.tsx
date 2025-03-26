import React from "react";
import { View, Text, Image, StyleSheet, Linking } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";

const Footer = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <ScrollView>
      <View
        style={{
          height: 1010,
          backgroundColor: "#228654",
        }}
      >
        <View style={styles.footer1}>
          <Image
            source={require("../assets/logo.png")}
            style={{
              height: 140,
              width: 140,
            }}
          />
          <Text style={styles.footerText1}>Temp</Text>
          <Text style={styles.footerText2}>i</Text>
        </View>

        <View style={{ paddingLeft: 20, paddingTop: 10 }}>
          <Image
            source={require("../assets/tick2.png")}
            style={{
              height: 60,
              width: 150,
            }}
          />
        </View>

        <View>
          <Text style={styles.htkh}>Hỗ Trợ Khách Hàng</Text>
          <Text style={styles.htkh1} onPress={() => <></>}>
            Chính sách bảo mật
          </Text>
          <Text style={styles.htkh1} onPress={() => <></>}>
            Điều khoản dịch vụ
          </Text>
          <Text style={styles.htkh1} onPress={() => <></>}>
            Chính sách vận chuyển
          </Text>
          <Text style={styles.htkh1} onPress={() => <></>}>
            Hưỡng dẫn đặt hàng
          </Text>
          <Text style={styles.htkh1} onPress={() => <></>}>
            Khách hàng thân thiết
          </Text>
        </View>

        <View style={{ paddingLeft: 30, paddingTop: 20 }}>
          <Text style={styles.foot}>Danh mục sản phẩm</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, paddingLeft: 5, paddingTop: 5 }}>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Vegetable")}
              >
                Rau Củ Quả
              </Text>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Bakery")}
              >
                Các Loại Bánh
              </Text>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Milk")}
              >
                Trứng và Sữa
              </Text>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Snack")}
              >
                Đồ Ăn Vặt
              </Text>
            </View>

            <View style={{ flex: 1, paddingTop: 5 }}>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Meat")}
              >
                Các Loại Thịt
              </Text>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Drink")}
              >
                Đồ Uống
              </Text>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Care")}
              >
                Hóa Mỹ Phẩm
              </Text>
              <Text
                style={styles.dmsp1}
                onPress={() => navigation.navigate("Cleaning")}
              >
                Dụng Cụ Vệ Sinh
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 20, paddingLeft: 30 }}>
          <Text style={styles.foot}>Cửa Hàng</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign
              name="enviromento"
              size={24}
              color="white"
              style={{ paddingTop: 10 }}
            />
            <Text
              style={{
                paddingTop: 10,
                color: "white",
                marginRight: 30,
                fontSize: 15,
                paddingLeft: 6,
              }}
              onPress={() =>
                Linking.openURL(
                  "https://www.google.com/maps/place/444+P.+T%C3%A2y+S%C6%A1n,+Th%E1%BB%8Bnh+Quang,+%C4%90%E1%BB%91ng+%C4%90a,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@21.0033412,105.8182583,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ac84666e4e57:0x59a3a906b6a120c0!8m2!3d21.0033362!4d105.8208332!16s%2Fg%2F11sbp_5p7l?entry=ttu&g_ep=EgoyMDI1MDMxMS4wIKXMDSoASAFQAw%3D%3D"
                )
              }
            >
              Cơ Sở 1: Số 444, Tây Sơn, Thịnh Quang, Đống Đa, Hà Nội
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign
              name="enviromento"
              size={24}
              color="white"
              style={{ paddingTop: 10 }}
            />
            <Text
              style={{
                paddingTop: 10,
                color: "white",
                marginRight: 30,
                fontSize: 15,
                paddingLeft: 6,
              }}
              onPress={() =>
                Linking.openURL(
                  "https://www.google.com/maps/place/444+P.+X%C3%A3+%C4%90%C3%A0n,+Nam+%C4%90%E1%BB%93ng,+%C4%90%E1%BB%91ng+%C4%90a,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@21.0161163,105.8278264,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ab83c8a073b9:0x999849f16ff70952!8m2!3d21.0161114!4d105.8326973!16s%2Fg%2F11y7hchsbs?entry=ttu&g_ep=EgoyMDI1MDMxMS4wIKXMDSoASAFQAw%3D%3D"
                )
              }
            >
              Cơ Sở 2: Số 444, Xã Đàn, Nam Đồng, Đống Đa, Hà Nội
            </Text>
          </View>
        </View>

        <View style={{ paddingTop: 20, paddingLeft: 30 }}>
          <Text style={styles.foot}>Liên Hệ</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6
              name="facebook"
              size={35}
              color="white"
              style={{ paddingTop: 10, paddingLeft: 10 }}
              onPress={() => Linking.openURL("https://www.facebook.com/")}
            />
            <Text
              style={{
                fontSize: 17,
                color: "white",
                paddingTop: 10,
                paddingLeft: 15,
              }}
              onPress={() => Linking.openURL("https://www.facebook.com/")}
            >
              Tempi Supermarket
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 10,
              paddingLeft: 10,
            }}
          >
            <Fontisto name="email" size={35} color="white" />
            <Text style={{ color: "white", fontSize: 17, paddingLeft: 15 }}>
              tempi@gmail.com
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 10,
              paddingTop: 10,
            }}
          >
            <FontAwesome6 name="phone-flip" size={33} color="white" />
            <Text style={{ fontSize: 17, color: "white", paddingLeft: 17 }}>
              0123 456 789
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingTop: 30,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontStyle: "italic" }}>
            Copyright © 2025 Tempi Shop.{" "}
          </Text>
          <Text
            style={{ color: "white", fontStyle: "italic" }}
            // onPress={() =>
            //   Linking.openURL(
            //     "https://www.haravan.com/?utm_campaign=poweredby&utm_medium=haravan&utm_source=onlinestore"
            //   )
            // }
          >
            Powered by Haravan
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footer1: {
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  footerText1: {
    marginLeft: 10,
    textAlign: "right",
    color: "white",
    fontSize: 50,
    fontWeight: "900",
  },

  footerText2: {
    textAlign: "left",
    fontSize: 50,
    color: "#6C03FF",
    fontWeight: "900",
  },

  htkh: {
    fontSize: 23,
    color: "white",
    fontWeight: "600",
    paddingLeft: 30,
    paddingTop: 25,
    paddingBottom: 10,
  },

  htkh1: {
    color: "white",
    paddingLeft: 40,
    paddingTop: 7,
    fontSize: 17,
  },

  foot: {
    fontSize: 23,
    color: "white",
    fontWeight: "600",
  },

  dmsp1: {
    color: "white",
    fontSize: 17,
    paddingTop: 5,
  },
});

export default Footer;
