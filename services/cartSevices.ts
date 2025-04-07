import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { get, post } from "../utils/request";

export const getCart = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await get("/carts", config);
  return response;
};

// export const getProduct = async (
//   config: AxiosRequestConfig = {}
// ): Promise<AxiosResponse> => {
//   const response = await get("/products", config);
//   return response;
// };

export interface Option {
  quantity: number;
}

export const PostCart = async (
  productId: string,
  config: AxiosRequestConfig = {},
  option: Option
): Promise<AxiosResponse> => {
  const response = await post(`/carts/add/${productId}`, config, option);
  return response;
};
