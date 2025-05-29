import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { setConfig } from "../helper/setConfig";
import { getListOrder } from "../services/orderServices";

interface Product {
  _id: string; // cartId
  titleProduct: string;
  price: number;
  thumbnail: string;
  discountPercentage: number;
  quantity: number;
  product_id: string;
  stock: number;
  selected: boolean;
}

interface UserInfo {
  fullName: string;
  phone: string;
  address: string;
}

interface Order {
  _id: string;
  totalPrice: number;
  products: Product[];
  userInfo: UserInfo;
}

const DetailListOrder = ({ route }: any) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const { orderId } = route.params;

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const config = await setConfig();
      const response = await getListOrder(config);
      if (response.data.code === 200) {
        const order = response.data.orders;
        setOrders(order);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView style={styles.cardContainer}>
      <View style={styles.container}>
        {orders.length > 0 &&
          (() => {
            const order = orders.find((o) => o._id === orderId);
            if (order) {
              return (
                <View>
                  <Text style={styles.text}>THÔNG TIN KHÁCH HÀNG</Text>
                  <View style={styles.infoUser}>
                    <Text style={styles.infoText}>
                      Họ tên: {order.userInfo.fullName}
                    </Text>
                    <Text style={styles.infoText}>
                      Số điện thoại: {order.userInfo.phone}
                    </Text>
                    <Text style={styles.infoText}>
                      Địa chỉ: {order.userInfo.address}
                    </Text>
                  </View>

                  <Text style={styles.text}>THÔNG TIN ĐƠN HÀNG</Text>
                  {order.products.map((product) => (
                    <View style={styles.infoOrder}>
                      <Image
                        source={{ uri: product.thumbnail }}
                        style={{ width: 100, height: 80 }}
                      />
                      <View style={styles.infoOrderText}>
                        <Text style={styles.infoText}>
                          {product.titleProduct}
                        </Text>
                        <Text style={styles.infoText}>
                          Số lượng: {product.quantity}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.infoPrice}>
                    <Text style={styles.text}>Tổng tiền: </Text>
                    <Text style={styles.price}>{order.totalPrice} $</Text>
                  </View>
                </View>
              );
            } else {
              return <Text>Không tìm thấy đơn hàng</Text>;
            }
          })()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginBottom: 40,
  },

  container: {
    flex: 1,
    margin: 15,
  },

  infoUser: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  infoOrder: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
  },

  infoOrderText: {
    flexDirection: "column",
    justifyContent: "space-around",
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },

  infoText: {
    fontSize: 15,
    fontWeight: "500",
  },

  infoPrice: {
    flexDirection: "row",
    alignItems: "center",
  },

  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "red",
  },
});

export default DetailListOrder;
