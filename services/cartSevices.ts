import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import { get, post, patch, deleteRequest } from "../utils/request";

export interface postcart {
  quantity: number;
}

export const getCart = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await get("/carts", config);
  return response;
};

export const PostCart = async (
  productId: string,
  config: AxiosRequestConfig = {},
  option: postcart
): Promise<AxiosResponse> => {
  const response = await post(`/carts/add/${productId}`, config, option);
  return response;
};

export interface updatecart {
  quantity: number;
}

export const updateCart = async (
  productId: string,
  config: AxiosRequestConfig = {},
  quantity: updatecart
): Promise<AxiosResponse> => {
  const response = await patch(`/carts/update/${productId}`, config, quantity);
  return response;
};

// interface selectedData {
//   product_id: string;
//   selected: boolean;
// }

export const selectedCart = async (
  config: AxiosRequestConfig = {},
  data: string[]
): Promise<AxiosResponse> => {
  const response = await patch("/carts/selected", config, {
    productSelected: data,
  });
  return response;
};

export const deleteCart = async (
  product_id: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const response = await deleteRequest(`/carts/delete/${product_id}`, config);
  return response;
};
