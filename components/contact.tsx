import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Footer from "./footer";

const Contact = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  return (
    <ScrollView>
      <Text style={styles.lienhe}>Liên Hệ</Text>
      <View>
        <Text style={styles.text1}>
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn! Nếu bạn có bất kỳ
          thắc mắc, góp ý hoặc cần hỗ trợ về sản phẩm và dịch vụ, hãy liên hệ
          với chúng tôi qua các kênh dưới đây.
        </Text>
        <Text style={styles.text1}>
          Chúng tôi cam kết mang đến dịch vụ hỗ trợ khách hàng tốt nhất, giải
          đáp mọi thắc mắc nhanh chóng và chính xác. Dù bạn cần hỗ trợ về đơn
          hàng, chính sách đổi trả hay thông tin sản phẩm, đội ngũ chăm sóc
          khách hàng của chúng tôi luôn sẵn sàng hỗ trợ 24/7.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          marginTop: 20,
        }}
      >
        <AntDesign name="enviromento" size={20} color="black" />
        <Text style={{ fontWeight: "600", fontSize: 15 }}>Địa chỉ:</Text>
        <Text style={{ paddingRight: 50, fontSize: 15 }}>
          {" "}
          Số 444, Tây Sơn, Thịnh Quang, Đống Đa, Hà Nội | Số 444, Xã Đàn, Nam
          Đồng, Đống Đa, Hà Nội
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          marginTop: 20,
        }}
      >
        <Feather name="phone" size={20} color="black" />
        <Text style={{ fontWeight: "600", fontSize: 15 }}>Hotline: </Text>
        <Text style={{ paddingRight: 50, fontSize: 15 }}> 1900 8888</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          marginTop: 20,
        }}
      >
        <Ionicons name="mail-open-outline" size={20} color="black" />
        <Text style={{ fontWeight: "600", fontSize: 15 }}>Email: </Text>
        <Text style={{ paddingRight: 50, fontSize: 15 }}> tempi@gmail.com</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          marginTop: 20,
        }}
      >
        <MaterialIcons name="phone-android" size={20} color="black" />
        <Text style={{ fontWeight: "600", fontSize: 15 }}>Zalo: </Text>
        <Text style={{ paddingRight: 50, fontSize: 15 }}>
          Tampi Official (0123 456 789)
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          marginTop: 20,
        }}
      >
        <Ionicons name="logo-facebook" size={20} color="black" />
        <Text style={{ fontWeight: "600", fontSize: 15 }}>Facebook: </Text>
        <Text
          style={{ paddingRight: 50, fontSize: 15 }}
          onPress={() => Linking.openURL("https://www.facebook.com/")}
        >
          {" "}
          Tampi Store
        </Text>
      </View>
      <Text style={styles.text2}>
        Bạn cũng có thể ghé thăm trung tâm hỗ trợ khách hàng của chúng tôi tại
        địa chỉ trên để được tư vấn trực tiếp. Chúng tôi hoan nghênh mọi ý kiến
        đóng góp và sẵn sàng hỗ trợ bạn 24/7. Hãy kết nối với chúng tôi ngay hôm
        nay!{" "}
      </Text>

      {/* <Footer /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  lienhe: {
    fontSize: 30,
    fontWeight: "500",
    paddingLeft: 20,
    paddingVertical: 20,
  },

  text1: {
    fontSize: 16,
    marginHorizontal: 30,
    marginBottom: 10,
  },

  text2: {
    fontSize: 16,
    marginHorizontal: 30,
    marginVertical: 20,
  },
});

export default Contact;
