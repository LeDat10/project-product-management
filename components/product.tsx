import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Product = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <ScrollView>
      <Text style={styles.danhmuc}>Danh Mục Sản Phẩm</Text>
      {/* list menu */}
      <View style={styles.listMenu}>
        {/* Row1 */}
        <View style={styles.row}>
          <View style={styles.menu}>
            <View style={styles.innerImage}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Vegetable")}
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

        {/* Row 2 */}
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

          <View style={styles.menu}>
            <View style={styles.innerImage}>
              <TouchableOpacity onPress={() => navigation.navigate("Cleaning")}>
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
            <Text style={styles.Text}>Đồ CS Cá nhân</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  danhmuc: {
    fontSize: 25,
    fontWeight: "500",
    paddingLeft: 20,
    paddingTop: 15,
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
    fontSize: 11,
    fontWeight: "800",
    padding: 6,
  },

  innerImage: {
    backgroundColor: "white",
    borderRadius: 100,
    width: 70,
    height: 70,
    overflow: "hidden",
  },
});

export default Product;
