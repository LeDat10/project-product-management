import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import ImageSlide from "./imageSlide";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "./footer";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Vegatable from "./menu/vegatable";

const HomeScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate("search")}
        >
          <EvilIcons
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
          <Text style={styles.searchProduct}>Tìm kiếm sản phẩm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.area}>
          <Text style={styles.text}>
            Tempi – Sản phẩm chất lượng, giá tốt mỗi ngày, giao hàng tận tay –
            Mua ngay kẻo lỡ!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("product")}
          >
            <Text style={styles.textButton}>Mua Sắm Ngay</Text>
          </TouchableOpacity>
        </View>
        {/* <ImageSlide /> */}
        <Image
          style={{ width: "100%", height: 105 }}
          source={require("../assets/anh1.png")}
        />

        <View style={styles.listMenu}>
          {/* Row1 */}
          <View style={styles.row}>
            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Vegetable");
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/vegetable.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Rau Củ Quả</Text>
            </View>

            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity onPress={() => navigation.navigate("Bakery")}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/bakery.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Các Loại Bánh</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity onPress={() => navigation.navigate("Snack")}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/snack.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Đồ Ăn Vặt</Text>
            </View>

            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity onPress={() => navigation.navigate("Milk")}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/milk.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Trứng Và Sữa</Text>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity onPress={() => navigation.navigate("Meat")}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/meat.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Các Loại Thịt</Text>
            </View>

            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity onPress={() => navigation.navigate("Drink")}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/drink.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Đồ Uống</Text>
            </View>
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Cleaning")}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/cleaning.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Dụng cụ vệ sinh</Text>
            </View>

            <View style={styles.menu}>
              <View style={styles.innerImage}>
                <TouchableOpacity onPress={() => navigation.navigate("Care")}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/care.png")}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.Text}>Hóa Mỹ Phẩm</Text>
            </View>
          </View>
        </View>

        {/* Best Saller */}
        <View style={styles.areaBL}>
          <Text style={styles.textbestseller}>Best Seller</Text>
        </View>

        {/* deal of the week: cleaning */}
        <View style={styles.areaDeal}>
          <Text style={styles.deal}>DEAL OF THE WEEK</Text>
          <Text style={styles.textCoupon}>40% OFF</Text>
          <Text style={styles.textCleaning}>CLEANING SUPPLIES</Text>
          <View style={styles.imgClean}>
            <ImageBackground
              source={require("../assets/anh4.png")}
              style={{
                height: 130,
                width: 250,
              }}
            >
              <View style={styles.textButton2}>
                <TouchableOpacity
                  style={styles.buttonImgClean}
                  onPress={() => navigation.navigate("Cleaning")}
                >
                  <Text style={styles.textButton2}>Mua Sắm Ngay</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* deal of the week: drink */}
        <View style={styles.areaDeal2}>
          <Text style={styles.deal2}>DEAL OF THE WEEK</Text>
          <Text style={styles.textCoupon}>30% OFF</Text>
          <Text style={styles.textDrink}>SOFT DRINK BRANDS</Text>
        </View>

        {/* shop fresh finds */}
        <View style={styles.areaFresh}>
          <Text style={styles.fresh}>Shop Fresh Finds</Text>
        </View>

        {/* giới thiệu ngắn */}
        <View style={{ paddingVertical: 130 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../assets/tick.png")}
              style={{
                height: 50,
                width: 60,
              }}
            />
          </View>
          <Text style={styles.paragraph}>
            Cửa hàng tạp hóa Tampi là địa chỉ uy tín chuyên cung cấp nhiều loại
            mặt hàng thiết yếu phục vụ nhu cầu hàng ngày. Với phương châm “Chất
            lượng – Tiện lợi – Giá cả hợp lý”, Tampi cam kết mang đến cho khách
            hàng những sản phẩm tươi ngon, an toàn, có nguồn gốc xuất xứ rõ
            ràng. Tại đây, bạn có thể dễ dàng tìm thấy mọi thứ từ thực phẩm, đồ
            uống, nhu yếu phẩm cho đến đồ gia dụng và văn phòng phẩm. Nhân viên
            thân thiện, phục vụ tận tình, sẵn sàng hỗ trợ khách hàng mua sắm một
            cách nhanh chóng, thuận tiện nhất. Hãy đến Tampi để trải nghiệm dịch
            vụ chuyên nghiệp và tận hưởng những ưu đãi hấp dẫn!{" "}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: "90%",
    height: 48,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    paddingHorizontal: 12,
  },

  searchProduct: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "center",
  },

  searchIcon: {
    // borderWidth: 1,
    // borderColor: "red",
    height: 48,
    textAlign: "left",
    textAlignVertical: "center",
    marginRight: 10,
  },

  area: {
    backgroundColor: "#228654",
    height: 140,
  },

  text: {
    textAlign: "center",
    paddingTop: 16,
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

  button: {
    width: 143,
    height: 45,
    marginHorizontal: 120,
    marginTop: 20,
    backgroundColor: "#FFB13F",
    borderRadius: 20,
    elevation: 5, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  textButton: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  listMenu: {
    paddingTop: 20,
    paddingBottom: 70,
  },

  menu: {
    flexDirection: "column",
    alignItems: "center",
  },

  Text: {
    fontSize: 14,
    fontWeight: "800",
    padding: 6,
  },

  textbestseller: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  areaBL: {
    height: 600,
  },

  deal: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    paddingTop: 30,
  },

  areaDeal: {
    height: 315,
    backgroundColor: "#228654",
  },

  textCoupon: {
    textAlign: "center",
    color: "#FFB13F",
    paddingTop: 26,
    fontWeight: "bold",
    fontSize: 25,
  },

  textCleaning: {
    textAlign: "center",
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
    paddingTop: 10,
  },

  imgClean: {
    alignItems: "center",
    paddingTop: 15,
  },

  buttonImgClean: {
    width: 180,
    height: 55,
    marginLeft: 40,
    backgroundColor: "#FFB13F",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  textButton2: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    paddingTop: 13,
  },

  areaDeal2: {
    paddingTop: 70,
    height: 700,
  },

  deal2: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    color: "#228654",
    paddingTop: 30,
  },

  textDrink: {
    textAlign: "center",
    color: "#228654",
    fontSize: 20,
    paddingTop: 10,
    fontWeight: "500",
  },

  areaFresh: {
    height: 600,
    backgroundColor: "#228654",
  },

  fresh: {
    textAlign: "center",
    color: "white",
    fontSize: 27,
    fontWeight: "bold",
    paddingTop: 30,
  },

  paragraph: {
    textAlign: "center",
    marginHorizontal: 25,
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },

  innerImage: {
    backgroundColor: "white",
    borderRadius: 100,
    width: 130,
    height: 130,
    overflow: "hidden",
    elevation: 5, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default HomeScreen;
