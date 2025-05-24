import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/apiClient";

// Định nghĩa interface cho phản hồi từ API
interface UserInfoResponse {
  code?: number;
  message?: string;
  user?: {
    _id?: string;
    email?: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullName?: string;
    phone?: string;
    status?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const getAuthConfig = async () => {
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

export const getCartConfig = async () => {
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

export const getConfig = async () => {
  const token = await AsyncStorage.getItem("token");
  const cartId = await AsyncStorage.getItem("cartId");
  
  const headers: Record<string, string> = {};
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  
  if (cartId) {
    headers.cartId = cartId;
  }
  
  return headers.authorization || headers.cartId ? { headers } : {};
};

export const removeStoredData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data for key ${key} has been removed`);
    return true;
  } catch (error) {
    console.log(`Error removing data for key ${key}`, error);
    return false;
  }
};

export const getUserInfo = async (): Promise<UserInfoResponse | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("Chưa đăng nhập. Không tìm thấy token!");
      throw new Error("Chưa đăng nhập. Không tìm thấy token!");
    }

    console.log("Token được sử dụng:", token);

    // Đảm bảo token được gửi đúng cách trong headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Config gửi API với endpoint /users/info:", config);
    // Gọi API với cấu hình đã sửa
    const response = await apiClient.get("/users/info", config);
    console.log("Phản hồi từ API user/info:", response);

    if (response.data) {
      await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
      console.log("Đã lưu thông tin người dùng vào AsyncStorage");
    }

    return response.data as UserInfoResponse;
  } catch (error: any) {
    console.log("Lỗi khi lấy thông tin người dùng:", error.message || error);
    if (error.response) {
      console.log("Lỗi phản hồi từ server:", error.response.status);
      console.log("Chi tiết lỗi:", error.response.data);
    } else if (error.request) {
      console.log("Không nhận được phản hồi từ server");
    }
    throw error;
  }
};

// Hàm để lấy thông tin người dùng từ AsyncStorage (nếu đã được lưu trước đó)
export const getCachedUserInfo = async (): Promise<UserInfoResponse | null> => {
  try {
    const userInfoString = await AsyncStorage.getItem("userInfo");    if (userInfoString) {
      return JSON.parse(userInfoString) as UserInfoResponse;
    }
    return null;
  } catch (error) {
    console.log("Lỗi khi lấy thông tin người dùng từ bộ nhớ cache:", error);
    return null;
  }
};

// Hàm xóa thông tin người dùng (hữu ích khi đăng xuất)
export const clearUserInfo = async () => {
  try {
    await AsyncStorage.removeItem("userInfo");
    console.log("Đã xóa thông tin người dùng");
    return true;
  } catch (error) {
    console.log("Lỗi khi xóa thông tin người dùng:", error);
    return false;
  }
};
