import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteCart,
  getCart,
  selectedCart,
  updatecart,
  updateCart,
} from "../services/cartSevices";
import { removeData, setConfig } from "../helper/setConfig";
import { calcPrice } from "../helper/calcPrice";
import Checkbox from "expo-checkbox";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { getConfig } from "../helper/getToken";
// import { useCallback } from "react";

interface Product {
  _id: string; // cartId
  titleProduct: string;
  price: number;
  thumbnail: string;
  discountPercentage: Double;
  quantity: number;
  product_id: string;
  stock: number;
  selected: boolean;
}

const Cart = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [loading, setLoading] = useState(false);
  const [cartproduct, setCartproduct] = useState<Product[]>([]);
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const fetchAPI = async (): Promise<void> => {
    setLoading(true);
    try {
      const config = await setConfig();
      const response = await getCart(config);
      if (response) {
        setLoading(false);
      }

      const productData = response.data.cart["products"];
      // console.log(response.data.cart["products"]);

      const cartId = response.headers["cartid"];
      if (cartId) {
        await AsyncStorage.setItem("cartId", cartId);
      }
      // await removeData("cartId");
      // console.log(config);
      // const cartId = response.data.cart["_id"];

      const newSelected: { [key: string]: boolean } = {};
      productData.forEach((item: Product) => {
        newSelected[item.product_id] = item.selected || false;
      });
      // console.log(newSelected);

      setSelected(newSelected);
      setCartproduct(productData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAPI();
    }, [])
  );

  interface selectedData {
    productId: string;
    selected: boolean;
  }

  const sentSelectToApi = async (selectedState: selectedData[]) => {
    try {
      const productSelected = Array.isArray(selectedState) ? selectedState : [];

      const config2 = await setConfig();
      const response = await selectedCart(config2, productSelected);
    } catch (error) {
      console.log(error);
    }
  };

  const sumCheckbox = async (product_id: string) => {
    setSelected((prev) => {
      const newSelectedValue = !prev[product_id];
      const updateSelected = { ...prev, [product_id]: newSelectedValue };
      const productSelectedArray = Object.entries(updateSelected).map(
        ([productId, selected]) => ({
          productId,
          selected,
        })
      );
      sentSelectToApi(productSelectedArray);
      return updateSelected;
    });
  };

  const calcQuantity = () => {
    return cartproduct.reduce((sum, item) => {
      if (selected[item.product_id]) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);
  };

  const totalPrice = () => {
    return cartproduct.reduce((sum, item) => {
      if (selected[item.product_id]) {
        const newprice = parseFloat(
          (item.price - (item.price * item.discountPercentage) / 100).toFixed(2)
        );
        return sum + newprice * item.quantity;
      }
      return parseFloat(sum.toFixed(2));
    }, 0);
  };

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
      {/* <Text>Đơn hàng trên 200000</Text> */}
      <FlatList
        data={cartproduct}
        extraData={cartproduct}
        keyExtractor={(item) => item._id}
        style={styles.Row}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Checkbox
              value={selected[item.product_id]}
              // onChange={() => handleChange(item.product_id)}
              onValueChange={() => sumCheckbox(item.product_id)}
              style={styles.checkbox}
            />
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 100, height: 100 }}
            />

            <View style={styles.rowContainer}>
              <Text style={styles.title}>{item.titleProduct}</Text>
              <View style={styles.containerDiscount}>
                <Text style={styles.discount}>-{item.discountPercentage}%</Text>
              </View>
              <View style={styles.rowPrice}>
                <Text style={styles.newPrice}>
                  {calcPrice(item.price, item.discountPercentage)}$
                </Text>
                <Text style={styles.oldPrice}>{item.price}$</Text>
              </View>

              <View style={styles.counterContainer}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantity}
                    onPress={async () => {
                      if (item.quantity > 1) {
                        const newQuantity = item.quantity - 1;
                        const newquantity: updatecart = {
                          quantity: newQuantity,
                        };
                        const config = await setConfig();
                        const response = await updateCart(
                          item.product_id,
                          config,
                          newquantity
                        );
                        if (response.data.code === 200) {
                          const updatedCart = cartproduct.map((p) =>
                            p._id === item._id
                              ? { ...p, quantity: newQuantity }
                              : p
                          );
                          setCartproduct(updatedCart);
                          // console.log(response.data.message);
                        }
                      }
                    }}
                  >
                    <Text style={styles.sign}>-</Text>
                  </TouchableOpacity>

                  <View style={styles.countText}>
                    <Text style={styles.count}>{item.quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.quantity}
                    onPress={async () => {
                      if (item.quantity >= item.stock) {
                        Alert.alert(
                          "Thông báo",
                          "Số lượng vượt quá số sản phẩm trong kho!"
                        );
                        return;
                      }
                      const newQuantity = item.quantity + 1;
                      const newquantity: updatecart = {
                        quantity: newQuantity,
                      };
                      const config = await setConfig();
                      const response = await updateCart(
                        item.product_id,
                        config,
                        newquantity
                      );
                      if (response.data.code === 200) {
                        const updatedCart = cartproduct.map((p) =>
                          p._id === item._id
                            ? { ...p, quantity: newQuantity }
                            : p
                        );
                        setCartproduct(updatedCart);
                        // console.log(response.data.message);
                      }
                    }}
                  >
                    <Text style={styles.sign}>+</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const config3 = await setConfig();
                        const response = await deleteCart(
                          item.product_id,
                          config3
                        );
                        if (response.data.code === 200) {
                          const updatedCart2 = cartproduct.filter(
                            (p) => p._id !== item._id
                          );
                          setCartproduct(updatedCart2);
                          // console.log(response.data.message);
                        } else {
                          console.log(response.data.message);
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <Text style={styles.textDelete}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.stock}>Còn {item.stock} sản phẩm</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.cartEmpty}>
            <Image
              source={require("../assets/empty_cart-removebg-preview.png")}
              style={{ width: 350, height: 350 }}
            />
            <Text style={styles.textCartEmpty}>Giỏ hàng trống</Text>
          </View>
        }
      />

      <View style={styles.payContainer}>
        <View style={styles.sumQuantity}>
          <Text style={styles.textquantity}>Số lượng sản phẩm:</Text>
          <Text style={styles.calcQuantity}>{calcQuantity()}</Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.texttotal}>Tổng tiền:</Text>
          <Text style={styles.totalPrice}>{totalPrice()}$</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.buttonPayment}
            onPress={async () => {
              const token = await AsyncStorage.getItem("token");
              console.log(token);
              if (token) {
                navigation.navigate("order");
              } else {
                Alert.alert(
                  "Thất bại",
                  "Vui lòng đăng nhập tài khoản để thanh toán",
                  [
                    {
                      text: "Thoát",
                      style: "cancel",
                    },
                    {
                      text: "Đăng nhập",
                      onPress: () => navigation.navigate("login"),
                    },
                  ]
                );
              }
            }}
          >
            <Text style={styles.textPayment}>THANH TOÁN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },

  Row: {
    marginHorizontal: 10,
    marginTop: 10,
  },

  item: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
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
    color: "red",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },

  containerDiscount: {
    backgroundColor: "#fadbd8",
    paddingVertical: 3,
    borderRadius: 5,
    width: 50,
    marginBottom: 10,
  },

  discount: {
    color: "red",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  quantityContainer: {
    flexDirection: "row",
  },

  quantity: {
    borderWidth: 2,
    borderColor: "#228654",
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "space-between",
    width: "78%",
    // borderColor: "red",
    // borderWidth: 1,
  },

  countText: {
    width: 40,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#228654",
  },

  count: {
    fontSize: 15,
    fontWeight: "600",
  },

  sign: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 26,
  },

  checkbox: {
    alignItems: "center",
    marginRight: 15,
  },

  textDelete: {
    fontSize: 15,
    color: "#257cda",
    fontWeight: "500",
    paddingRight: 10,
  },

  stock: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#FFB13F",
    fontWeight: "500",
  },

  cartEmpty: {
    alignItems: "center",
  },

  textCartEmpty: {
    fontSize: 25,
    fontWeight: "600",
  },

  payContainer: {
    backgroundColor: "#F2F2F2",
    height: 200,
  },

  sumQuantity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textquantity: {
    fontSize: 20,
    fontWeight: "600",
    padding: 20,
  },

  calcQuantity: {
    fontSize: 20,
    fontWeight: "600",
    paddingRight: 50,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  texttotal: {
    fontSize: 20,
    fontWeight: "600",
    padding: 20,
    paddingTop: 0,
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "600",
    paddingRight: 50,
  },

  buttonPayment: {
    width: 356,
    height: 52,
    borderRadius: 25,
    backgroundColor: "#FFB13F",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    elevation: 5, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },

  textPayment: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
});

export default Cart;
