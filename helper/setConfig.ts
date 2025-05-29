import AsyncStorage from "@react-native-async-storage/async-storage";

export const setConfig = async () => {
  const cartId = await AsyncStorage.getItem("cartId");
  const token = await AsyncStorage.getItem("token");
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        cartId: cartId,
      },
    };
  } else {
    return {
      headers: {
        cartId: cartId,
      },
    };
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    // console.log("Dữ liệu đã được xóa");
  } catch (error) {
    console.log("Lỗi khi xóa dữ liệu", error);
  }
};
