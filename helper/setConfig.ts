import AsyncStorage from "@react-native-async-storage/async-storage";

export const setConfig = async () => {
  const cartId = await AsyncStorage.getItem("cartId");
  if (cartId) {
    return {
      headers: {
        cartId: cartId,
      },
    };
  } else {
    return {};
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Dữ liệu đã được xóa");
  } catch (error) {
    console.log("Lỗi khi xóa dữ liệu", error);
  }
};
