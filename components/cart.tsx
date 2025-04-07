import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
// import product, { GetCarts } from "../services/product";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import product from "../services/productServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCart } from "../services/cartSevices";
import { setConfig } from "../helper/setConfig";
import { calcPrice } from "../helper/calcPrice";

interface Product {
  _id: string; // cartId
  titleProduct: string;
  price: number;
  thumbnail: string;
  discountPercentage: Double;
  quantity: number;
}

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [cartproduct, setCartproduct] = useState<Product[]>([]);

  const fetchAPI = async (): Promise<void> => {
    setLoading(true);
    const config = await setConfig();
    // console.log(config);
    const response = await getCart(config);
    if (response) {
      setLoading(false);
    }
    // const cartId = response.headers["cartid"];
    const cartId = response.data.cart["_id"];
    await AsyncStorage.setItem("cartId", cartId);
    setCartproduct(response.data.cart["products"]);
    // console.log(response.data.cart["products"]);
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
    <View style={styles.container}>
      <FlatList
        data={cartproduct}
        keyExtractor={(item) => item._id}
        style={styles.Row}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 100, height: 100 }}
            />

            <View style={styles.rowContainer}>
              <Text style={styles.title}>{item.titleProduct}</Text>
              <Text style={styles.coupon}>-{item.discountPercentage}%</Text>
              <View style={styles.rowPrice}>
                <Text style={styles.newPrice}>
                  {calcPrice(item.price, item.discountPercentage)}$
                </Text>
                <Text style={styles.oldPrice}>{item.price}$</Text> // giá cũ
              </View>
              <Text>{item.quantity}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },
  Row: {
    backgroundColor: "#fff",
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  item: {
    marginBottom: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },

  rowContainer: {
    paddingLeft: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  rowPrice: {
    flexDirection: "row",
    alignItems: "center",
  },

  oldPrice: {
    fontSize: 11,
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  newPrice: {
    color: "#228654",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },

  coupon: {
    backgroundColor: "red",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    justifyContent: "center",
    padding: 3,
    width: 60,
    borderRadius: 3,
    marginBottom: 3,
  },
});

export default Cart;
