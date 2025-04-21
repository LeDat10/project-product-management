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

export const search = async (
  config: AxiosRequestConfig = {},
  query: string
): Promise<AxiosResponse> => {
  const response = await get("/search", {
    ...config,
    params: { keyword: query },
  });
  return response;
};

export const sort = async (
  config: AxiosRequestConfig = {},
  sortKey: string,
  sortValue: string,
  status: string
): Promise<AxiosResponse> => {
  const response = await get("/products", {
    ...config,
    params: { sortKey, sortValue, status },
  });
  return response;
};
