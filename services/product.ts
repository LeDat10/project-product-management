import apiClient, { ApiError } from "./apiClient";
import axios, { AxiosError } from "axios";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import { UserResponse } from "./accountService";

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

const getproduct = async (
  product: Product
): Promise<UserResponse | AxiosError> => {
  return apiClient.get<UserResponse>(`/products`, product);
};

export default getproduct;
