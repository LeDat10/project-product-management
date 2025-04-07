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
