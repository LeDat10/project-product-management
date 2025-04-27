import AsyncStorage from "@react-native-async-storage/async-storage";

export const setConfig = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    return {
      headers: {
        token: token,
      },
    };
  } else {
    return {};
  }
};
