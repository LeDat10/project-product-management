import AsyncStorage from "@react-native-async-storage/async-storage";

export const getConfig = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  } else {
    return {};
  }
};
