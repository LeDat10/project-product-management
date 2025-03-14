import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Footer from "./footer";

const AboutUs = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  return (
    <ScrollView>
      <Text style={styles.gioithieu}>Giới Thiệu</Text>
      <View style={styles.areaGT}>
        <LinearGradient
          colors={["#acadac", "#fff"]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.background}
        >
          <Text style={styles.text1}>
            Tempi - Mua sắm dễ dàng, đa dạng sản phẩm
          </Text>

          <Text style={styles.text2}>
            Chào mừng bạn đến với Tempi, nền tảng mua sắm trực tuyến đa dạng sản
            phẩm từ thời trang, điện tử, mỹ phẩm đến đồ gia dụng và thực phẩm.
            Chúng tôi cam kết mang đến trải nghiệm mua sắm nhanh chóng, tiện lợi
            và an toàn cho khách hàng.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("product")}
          >
            <Text style={styles.text3}>Mua Sắm Ngay</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/people.png")}
            style={{ width: "100%", height: 100 }}
          />
        </LinearGradient>
      </View>

      <View style={styles.area}>
        <MaterialIcons
          name="production-quantity-limits"
          size={70}
          color="black"
          style={styles.icon1}
        />
        <Text style={styles.title1}>Đa Dạng Sản Phẩm</Text>
        <Text style={styles.text4}>
          Tempi mang đến cho bạn một thế giới mua sắm phong phú với các loại đồ
          ăn, đồ uống và đồ gia dụng chất lượng. Từ những món ăn vặt hấp dẫn,
          thực phẩm tươi ngon đến các loại nước giải khát, cà phê thơm lừng,
          chúng tôi có đầy đủ lựa chọn để đáp ứng mọi khẩu vị. Bên cạnh đó, các
          sản phẩm gia dụng tiện ích giúp cuộc sống của bạn trở nên dễ dàng và
          tiện lợi hơn bao giờ hết.
        </Text>
      </View>

      <View style={styles.area}>
        <AntDesign
          name="linechart"
          size={70}
          color="black"
          style={styles.icon1}
        />
        <Text style={styles.title1}>Sứ Mệnh Và Giá Trị</Text>
        <Text style={styles.text4}>
          Tempi không chỉ là một nền tảng mua sắm, mà còn là người bạn đồng hành
          trong cuộc sống hàng ngày của bạn. Chúng tôi cam kết mang đến những
          sản phẩm chất lượng, đa dạng với giá cả hợp lý, giúp việc mua sắm trở
          nên dễ dàng, tiện lợi và đáng tin cậy. Với phương châm "Khách hàng là
          trung tâm", Tempi không ngừng đổi mới, nâng cao dịch vụ và mở rộng
          danh mục sản phẩm để đáp ứng mọi nhu cầu. Chúng tôi tin rằng, sự tiện
          lợi trong mua sắm và trải nghiệm tuyệt vời của khách hàng chính là giá
          trị cốt lõi giúp Tempi phát triển bền vững.
        </Text>
      </View>

      <View style={styles.area}>
        <SimpleLineIcons
          name="like"
          size={70}
          color="black"
          style={styles.icon1}
        />
        <Text style={styles.title1}>Cam Kết Chất Lượng</Text>
        <Text style={styles.text4}>
          Tại Tempi, chúng tôi đặt chất lượng sản phẩm và sự hài lòng của khách
          hàng lên hàng đầu. Mỗi sản phẩm trên nền tảng đều được chọn lọc kỹ
          lưỡng từ các nhà cung cấp uy tín, đảm bảo nguồn gốc rõ ràng và đáp ứng
          các tiêu chuẩn an toàn. Chúng tôi cam kết cung cấp hàng chính hãng,
          chất lượng cao, cùng với chính sách đổi trả linh hoạt và bảo hành minh
          bạch, giúp khách hàng an tâm khi mua sắm. Với Tempi, bạn luôn có những
          trải nghiệm mua sắm đáng tin cậy và xứng đáng nhất.
        </Text>
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gioithieu: {
    fontSize: 30,
    fontWeight: "500",
    paddingLeft: 20,
    paddingTop: 20,
  },

  areaGT: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 420,
  },

  background: {
    height: 420,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },

  text1: {
    color: "black",
    fontSize: 25,
    marginHorizontal: 30,
    marginTop: 50,
    marginBottom: 10,
    fontWeight: "600",
  },

  text2: {
    fontSize: 15,
    marginHorizontal: 35,
    marginBottom: 20,
  },

  button: {
    width: 143,
    height: 45,
    marginLeft: 50,
    backgroundColor: "#FFB13F",
    borderRadius: 20,
    marginBottom: 20,
  },

  text3: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 10,
  },

  area: {
    backgroundColor: "#ebe8e8",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 40,
    paddingLeft: 20,
    paddingTop: 10,
    marginBlock: 20,
  },

  title1: {
    fontSize: 25,
    fontWeight: "600",
    paddingBottom: 10,
  },

  text4: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  icon1: {
    paddingTop: 20,
    paddingBlock: 10,
    paddingLeft: 10,
  },
});

export default AboutUs;
