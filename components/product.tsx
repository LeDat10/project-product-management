import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import axios from "axios";
import { getProduct } from "../services/productServices";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Sort from "./sort";

interface Product {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  images: string;
  stock: number;
  discountPercentage: number;
  slug: string;
}

const Product = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApi = async (): Promise<void> => {
    setLoading(true);
    const config = {};
    const response = await getProduct(config);
    setProduct(response.data.products);
    if (response) {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      fetchApi();
    } catch (error) {
      console.log(error);
    }
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
    <View style={styles.container}>
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

      <Sort />

      <FlatList
        data={product}
        numColumns={2}
        columnWrapperStyle={styles.Row}
        keyExtractor={(item) => item._id}
        // ListHeaderComponent={
        //   <View>
        //     <Text style={styles.danhmuc}>Danh Mục Sản Phẩm</Text>
        //     <View style={styles.listMenu}>
        //       {/* Row1 */}
        //       <View style={styles.row}>
        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Vegetable")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/vegetable.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Rau Củ Quả</Text>
        //         </View>

        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Bakery")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/bakery.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Các Loại Bánh</Text>
        //         </View>

        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Snack")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/snack.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Đồ Ăn Vặt</Text>
        //         </View>

        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Milk")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/milk.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Trứng Và Sữa</Text>
        //         </View>
        //       </View>

        //       {/* Row 2 */}
        //       <View style={styles.row}>
        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Meat")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/meat.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Các Loại Thịt</Text>
        //         </View>

        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Drink")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/drink.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Đồ Uống</Text>
        //         </View>

        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Cleaning")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/cleaning.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Dụng cụ vệ sinh</Text>
        //         </View>

        //         <View style={styles.menu}>
        //           <View style={styles.innerImage}>
        //             <TouchableOpacity
        //               onPress={() => navigation.navigate("Care")}
        //             >
        //               <Image
        //                 style={{ width: "100%", height: "100%" }}
        //                 source={require("../assets/care.png")}
        //                 resizeMode="cover"
        //               />
        //             </TouchableOpacity>
        //           </View>
        //           <Text style={styles.Text}>Hóa Mỹ Phẩm</Text>
        //         </View>
        //       </View>
        //     </View>
        //   </View>
        // }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.containerCoupon}>
              <Text style={styles.coupon}>-{item.discountPercentage}%</Text>
            </View>
            <Image
              source={{
                uri: item.thumbnail,
              }}
              style={styles.image}
            />
            <Text style={styles.name}> {item.title} </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.price}> {item.price} $</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("detail-product", { slug: item.slug })
              }
            >
              <Text style={styles.buttonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 490,
  },

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
    elevation: 5, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  Row: {
    justifyContent: "space-between", // Căn đều các item
    paddingBottom: 5,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    margin: 5,
    elevation: 3, // đổ bóng
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  name: {
    fontWeight: "bold",
    textAlign: "center",
  },

  price: {
    color: "red",
    fontSize: 16,
    marginVertical: 5,
    marginRight: 5,
  },

  containerCoupon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fadbd8",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 5,
    zIndex: 10, //  đảm bảo phần giảm giá hiển thị trên thumbnail
  },

  coupon: {
    color: "red",
    fontSize: 12,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

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
});

export default Product;
