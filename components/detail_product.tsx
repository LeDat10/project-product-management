import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Footer from "./footer";
import { SafeAreaView } from "react-native-safe-area-context";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import RenderHtml from "react-native-render-html";
import axios from "axios";

interface Detail_Product {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  images: string;
  stock: number;
  discountPercentage: Double;
}

const DetailProduct = ({ route }: any) => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { slug } = route.params;
  // console.log(id);
  const [inventory, setInventory] = useState(true);
  const [detail_product, setDetailProduct] = useState<Detail_Product | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const { width } = useWindowDimensions();

  // lấy dữ liệu sản phẩm từ api
  useEffect(() => {
    axios
      .get(
        `https://api-project-product-management.vercel.app/api/products/detail/${slug}`
      )
      .then((reponse) => {
        setDetailProduct(reponse.data.product);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (detail_product?.stock !== undefined) {
      setInventory(detail_product?.stock > 0);
    }
  });

  const [formData, setFormData] = useState({
    _id: "",
    quantity: "",
  });

  const handleButton = async () => {
    if (quantity === 0) {
      Alert.alert(
        "Thông báo", // Tiêu đề
        "Vui lòng chọn số lượng lớn hơn 0!", // Nội dung
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: true } // Cho phép nhấn ngoài để tắt
      );
    } else {
      setLoading2(false);
      // try {
      //   const formData = {
      //     _id: detail_product?._id,
      //     quantity: quantity,
      //   }
      //   const reponse = await axios.post(
      //     "https://api-project-product-management.vercel.app/api/cart/add",
      //     formData
      //   );
      //   setFormData({
      //     _id: "",
      //     quantity: "",
      //   });
      // } catch (error) {
      //   console.log(error);
      // } finally {
      //   setLoading(false);
      // }

      Alert.alert(
        "Thành công",
        `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`,
        [
          {
            text: "Tiếp tục mua sắm",
            style: "cancel",
          },
          {
            text: "Xem giỏ hàng",
            onPress: () => navigation.navigate("cart"),
          },
        ],
        { cancelable: true }
      );
    }
  };

  if (loading) {
    return <ActivityIndicator size={"large"} color="#0000ff" />;
  }

  if (!detail_product) {
    return <Text>Không tìm thấy sản phẩm</Text>;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Image
            source={{ uri: detail_product.thumbnail }}
            style={{ width: "100%", height: 300, objectFit: "cover" }}
          />
          <View style={styles.line1}>
            <Text style={styles.price}>{detail_product.price} VND</Text>
            <Text style={styles.coupon}>
              -{detail_product.discountPercentage}%
            </Text>
          </View>
          <Text style={styles.title}>{detail_product.title}</Text>
          <Text style={styles.stock}>
            Tình trạng:{" "}
            {inventory ? (
              <Text style={styles.inventory}>Còn hàng</Text>
            ) : (
              <Text style={styles.inventory}>Hết hàng</Text>
            )}
          </Text>
          <Text style={styles.detail}>Mô tả chi tiết: </Text>
          <Text style={styles.description}>
            <RenderHtml
              contentWidth={width}
              source={{ html: detail_product.description }}
            />
          </Text>
        </View>

        {/* <View style={{ paddingBottom: 70 }}></View> */}
      </ScrollView>

      <View style={styles.container}>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.quantity}
            onPress={() => setQuantity(Math.max(0, quantity - 1))}
          >
            <Text style={styles.sign}>-</Text>
          </TouchableOpacity>

          <View style={styles.countText}>
            <Text style={styles.count}>{quantity}</Text>
          </View>

          <TouchableOpacity
            style={styles.quantity}
            onPress={() =>
              setQuantity(Math.min(detail_product.stock || 0, quantity + 1))
            }
          >
            <Text style={styles.sign}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !inventory && styles.disbutton]}
          disabled={!inventory}
          onPress={handleButton}
        >
          <Text style={styles.text}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  line1: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  price: {
    fontSize: 32,
    fontWeight: "600",
  },

  coupon: {
    backgroundColor: "red",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    justifyContent: "center",
    padding: 3,
  },

  title: {
    fontWeight: "600",
    fontSize: 24,
    paddingLeft: 20,
    paddingBottom: 15,
  },

  stock: {
    paddingLeft: 20,
    paddingBottom: 15,
    fontSize: 16,
    fontStyle: "italic",
  },

  inventory: {
    color: "red",
    fontWeight: "600",
    fontStyle: "normal",
  },

  detail: {
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 20,
    paddingBottom: 5,
  },

  description: {
    fontSize: 16,
    paddingLeft: 20,
    paddingBottom: 90,
  },

  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    flex: 1,
    borderRadius: 25,
    marginLeft: 15,
    backgroundColor: "#FFB13F",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    elevation: 2, // Độ nổi cho Android
    shadowColor: "#000", // Độ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  disbutton: {
    backgroundColor: "#cccccc",
  },

  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.5,
  },

  quantity: {
    borderWidth: 2,
    borderColor: "#FFB13F",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 5,
  },

  countText: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#FFB13F",
  },

  count: {
    fontSize: 20,
    fontWeight: "600",
  },

  sign: {
    fontSize: 25,
    fontWeight: "600",
    lineHeight: 26,
  },
});

export default DetailProduct;
function async() {
  throw new Error("Function not implemented.");
}
