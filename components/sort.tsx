import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";
import { sort } from "../services/productServices";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { FlatList } from "react-native";

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

const Sort = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [options, setOptions] = useState("");

  const fetchSort = async () => {
    setLoading(true);
    try {
      // Xác định sortKey và sortValue dựa trên sortOption
      let sortKey = "";
      let sortValue = "";
      switch (options) {
        case "price-asc":
          sortKey = "price";
          sortValue = "asc";
          break;
        case "price-desc":
          sortKey = "price";
          sortValue = "desc";
          break;
        case "title-asc":
          sortKey = "title";
          sortValue = "asc";
          break;
        case "title-desc":
          sortKey = "title";
          sortValue = "desc";
          break;
        default:
          sortKey = ""; // Backend sẽ dùng mặc định (position, desc)
          sortValue = "";
      }

      const response = await sort({}, sortKey, sortValue, status);
      if (response.data.code === 200) {
        // console.log("Lấy sản phẩm thành công");
        setProducts(response.data.products);
      } else {
        // console.log("Lấy sản phẩm không thành công");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSort();
  }, [status, options]);

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

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <View style={styles.sort}>
          <Text style={styles.filterLabel}>Sắp xếp:</Text>
          <Picker
            selectedValue={options}
            style={styles.picker}
            onValueChange={(value) => setOptions(value)}
          >
            <Picker.Item label="Mặc định" value="" />
            <Picker.Item label="Giá từ thấp đến cao" value="price-asc" />
            <Picker.Item label="Giá từ cao đến thấp" value="price-desc" />
            <Picker.Item label="Tên từ A đến Z" value="title-asc" />
            <Picker.Item label="Tên từ Z đến A" value="title-desc" />
          </Picker>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={products}
        numColumns={2}
        columnWrapperStyle={styles.Row}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },

  filters: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  status: {
    flex: 1,
    marginRight: 5,
  },

  sort: {
    flex: 1,
    marginLeft: 5,
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    // marginTop: 10,
  },

  picker: {
    height: 52,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },

  sortContainer: {
    flex: 1,
    backgroundColor: "white",
    marginLeft: 15,
    marginRight: 4,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
  },

  textSort: {
    paddingLeft: 10,
    borderRadius: 5,
    textAlign: "center",
    textAlignVertical: "center",
    // borderColor: "#ccc",
  },

  sortIcon: {
    marginLeft: 15,
  },

  filterContainer: {
    flex: 1,
    height: 37,
    backgroundColor: "white",
    marginRight: 15,
    marginLeft: 4,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
  },

  textFilter: {
    paddingLeft: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },

  filterIcon: {
    marginLeft: 15,
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

  emptyProduct: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default Sort;
