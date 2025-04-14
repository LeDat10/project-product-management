import { AxiosRequestConfig, AxiosResponse } from "axios";
import { get } from "../utils/request";

export const getProduct = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await get("/products", config);
  return response;
};

export const detaiProduct = async (
  slug: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await get(`/products/detail/${slug}`, config);
  return response;
};
