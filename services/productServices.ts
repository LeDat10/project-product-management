import apiClient, { ApiError } from "./apiClient";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
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

export interface UserResponse {
  code: number;
  message: string;
  user?: any;
  token?: string;
  cartId?: string;
  cart?: Cart;
}

export interface Cart {
  products: Product[];
}

export interface AddCarts {
  quantity: number;
}

export interface GetCarts {
  title: string;
  price: number;
  thumbnail: string;
  discountPercentage: Double;
}

// const getproduct = async (
//   slug: string,
//   product: Product
// ): Promise<UserResponse | AxiosError> => {
//   return apiClient.get<UserResponse>(`/products/detail/${slug}`, product);
// };

const addCarts = async (
  productId: string,
  addCarts: AddCarts
): Promise<AxiosResponse> => {
  const response = await apiClient.post(`/carts/add/${productId}`, addCarts);
  return response;

  // return apiClient.post<UserResponse, AddCarts>(
  //   `/carts/add/${productId}`,
  //   addCarts
  // );
  // try {
  //   const response: AxiosResponse<UserResponse> = await apiClient.post(
  //     `/carts/add/${productId}`,
  //     addCarts
  //   );

  //   // console.log("Response from addCarts:", response);
  //   // console.log("Response Data:", response.data);
  //   // console.log("Response Headers:", response.headers);

  //   // response là AxiosResponse, nên lấy data và headers từ đó
  //   const cartId: unknown = response.headers["cartid"];
  //   if (typeof cartId === "string") {
  //     await AsyncStorage.setItem("cartId", cartId); // lưu cartid và asyncStorage
  //     console.log("Cart ID saved:", cartId);
  //   } else {
  //     console.warn(
  //       "No cartId found in response headers or cartId is not a string"
  //     );
  //   }
  //   return response.data;
  // } catch (error: any) {
  //   console.error("Error in addCarts:", error);
  //   return { error: error.message || "Unknown error occurred" };
  // }
};

const getCarts = async (): Promise<AxiosResponse> => {
  const response = await apiClient.get(`/carts`);
  return response;
};

export default { addCarts, getCarts };
