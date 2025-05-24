import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInput as TextInputType,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { search } from "../services/productServices";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

interface Product {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  images: string;
  stock: number;
  discountPercentage: Double;
  slug: string;
}

const Search = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const textInputRef = useRef<TextInputType>(null);

  useEffect(() => {
    const unsubcrise = navigation.addListener("focus", () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    });
    return unsubcrise;
  }, [navigation]);

  const fetchProduct = async (keyword: string) => {
    setLoading(true);
    try {
      const config = {};
      const response = await search(config, keyword);
      if (response.data.code === 200) {
        // console.log(response.data.message);
        setProducts(response.data.product || []);
      } else {
        console.log(response.data.message || "Không tìm thấy sản phẩm");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
    if (keyword.trim() === "") {
      setProducts([]);
      return;
    }
    fetchProduct(keyword);
  };

  const renderProduct = ({ item }: { item: Product }) => (
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
        <Text style={styles.price}> {item.price} VND</Text>
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

  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.searchContainer}>
          <EvilIcons
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            ref={textInputRef}
            style={styles.search}
            placeholder="Tìm kiếm sản phẩm"
            maxLength={25}
            value={keyword}
            onChangeText={handleSearch}
            autoFocus={true}
          />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={products}
        numColumns={2}
        columnWrapperStyle={styles.Row}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View>
            <Text style={styles.emptyProduct}>Không tìm thấy sản phẩm</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: "95%",
    height: 48,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    paddingHorizontal: 12,
  },

  search: {
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

  emptyProduct: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
  },

  Row: {
    justifyContent: "space-between", // Căn đều các item
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    margin: 5,
    elevation: 3,
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
    top: 5,
    right: 5,
    backgroundColor: "#fadbd8",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
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
});

export default Search;
