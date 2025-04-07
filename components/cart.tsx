import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
// import product, { GetCarts } from "../services/product";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import product from "../services/product";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  _id: string; // cartId
  titleProduct: string;
  price: number;
  thumbnail: string;
  discountPercentage: Double;
  quantity: number;
}

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [cartproduct, setCartproduct] = useState<Product[]>([]);

  const getCartId = async (): Promise<string | null> => {
    try {
      const cartId = await AsyncStorage.getItem("cartId");
      return cartId;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCartId = async () => {
      const cartId = await getCartId();
      console.log("CartId: ", cartId);

      if (cartId) {
        setLoading(true);
        try {
          const response = await axios.get(
            "https://api-project-product-management.vercel.app/api/carts",
            { headers: { cartid: cartId } }
          );
          setCartproduct(response.data.cart.products);
          console.log(response.data.cart.products);
        } catch (error) {
          console.log("Error: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCartId();
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
    <View>
      <FlatList
        data={cartproduct}
        // columnWrapperStyle={styles.Row}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.titleProduct}</Text>
            <Text>{item.price}</Text>
            <Text>{item.discountPercentage}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Row: {},
});

export default Cart;
