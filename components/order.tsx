import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { setConfig } from "../helper/setConfig";
import { getCart } from "../services/cartSevices";
import { FlatList } from "react-native-gesture-handler";
import { calcPrice } from "../helper/calcPrice";
import { getConfig } from "../helper/getToken";
import { postOrder } from "../services/orderServices";
import { NavigationProp, useNavigation } from "@react-navigation/native";

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

interface Info {
  fullName: string;
  number: string;
  address: string;
  email: string;
}

const Order = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [loading, setLoading] = useState(false);
  const [cartProduct, setCartProduct] = useState<Product[]>([]);
  const [fullName, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [shipping, setShipping] = useState(0);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const config = await setConfig();
      const response = await getCart(config);
      if (response) {
        setLoading(false);
      }
      setCartProduct(response.data.cart["products"]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleButton = async () => {
    setLoading(true);
    try {
      const userInfo: Info = {
        fullName: fullName,
        number: number,
        address: address,
        email: email,
      };
      const config = await getConfig();
      const response = await postOrder(config, userInfo);
      if (response && response.data.code === 200) {
        console.log(response.data.message);
        Alert.alert(
          "Thành công",
          response.data.message,
          [
            {
              text: "Tiếp tục mua sắm",
              onPress: () => navigation.navigate("product"),
            },
          ],
          { cancelable: true }
        );
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calcQuantity = () => {
    return cartProduct.reduce((sum, item) => {
      if (item.selected) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);
  };

  const totalPrice = () => {
    return cartProduct.reduce((sum, item) => {
      if (item.selected) {
        const newprice = parseFloat(
          (item.price - (item.price * item.discountPercentage) / 100).toFixed(2)
        );
        return sum + newprice * item.quantity;
      }
      return parseFloat(sum.toFixed(2));
    }, 0);
  };

  useEffect(() => {
    const price = totalPrice();
    if (price < 200) {
      setShipping(1.5);
    } else {
      setShipping(0);
    }
  }, [totalPrice]);

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: 50, height: 50 }}
          />
          <View style={styles.itemTitle}>
            <View>
              <Text style={styles.title}>{item.titleProduct}</Text>
              <View style={styles.rowPrice}>
                <Text style={styles.newPrice}>
                  {calcPrice(item.price, item.discountPercentage)}$
                </Text>
                <Text style={styles.oldPrice}>{item.price}$</Text>
              </View>
            </View>
            <Text style={styles.quantity}>Số lượng: x{item.quantity}</Text>
          </View>
        </View>
      </View>
    );
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
      <FlatList
        data={cartProduct}
        extraData={cartProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View>
            <Text style={styles.text}>Thông tin khách hàng: </Text>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              maxLength={25}
            />

            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={number}
              onChangeText={setNumber}
              maxLength={25}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              maxLength={25}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              maxLength={25}
            />

            <Text style={styles.text}>Thông tin đơn hàng: </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View>{item.selected ? renderProduct({ item }) : null}</View>
        )}
        ListFooterComponent={
          <View style={styles.info}>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>Tổng số sản phẩm:</Text>
              <Text style={styles.infoText}>{calcQuantity()}</Text>
            </View>

            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>Phí vận chuyển: </Text>
              <Text style={styles.infoText}>{shipping}$</Text>
            </View>

            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>Tổng tiền:</Text>
              <Text style={styles.infoText}>{totalPrice() + shipping}$</Text>
            </View>
            <View>
              <Text style={styles.text}>Phương thức thanh toán </Text>
            </View>
          </View>
        }
      />
      <View style={styles.orderContainer}>
        <TouchableOpacity style={styles.orderButton} onPress={handleButton}>
          <Text style={styles.orderText}>ĐẶT HÀNG</Text>
        </TouchableOpacity>
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
  },

  item: {
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    margin: 10,
    marginBottom: 0,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  itemContainer: {
    flexDirection: "row",
    paddingLeft: 5,
    alignItems: "center",
  },

  itemTitle: {
    flexDirection: "column",
    paddingLeft: 15,
    flex: 1,
    // borderWidth: 1,
    // borderColor: "red",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  rowPrice: {
    flexDirection: "row",
    alignItems: "center",
  },

  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  newPrice: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },

  quantity: {
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "600",
    textAlign: "right",
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    marginTop: 5,
    marginHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },

  orderContainer: {
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
    padding: 10,
    alignItems: "center",
    // backgroundColor: "#ccc",
  },

  orderButton: {
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

  orderText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },

  info: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 5,
    paddingVertical: 10,
  },

  infoTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  infoText: {
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 5,
  },
});

export default Order;
