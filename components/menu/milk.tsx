import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { getProduct } from "../../services/productServices";
import Sort from "../sort";
import { FlatList } from "react-native-gesture-handler";

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
  categoryTitle: string;
}

const Milk = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const config = {};
      const response = await getProduct(config);
      setProduct(response.data.products);
      if (response) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const renderItem = ({ item }: { item: Product }) => {
    return (
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

  const productCategory = product.filter(
    (item) =>
      item.categoryTitle &&
      item.categoryTitle.toLowerCase().trim() ===
        "Trứng và sữa".toLowerCase().trim()
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productCategory}
        numColumns={2}
        columnWrapperStyle={styles.Row}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Không tìm thấy sản phẩm</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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

  empty: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
  },
});

export default Milk;
