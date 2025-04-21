import { StyleSheet } from "react-native";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const TIMES_NEW_ROMAN = "Times_New_Roman";

export const globalStyles = StyleSheet.create({
  globalFont: {
    fontFamily: TIMES_NEW_ROMAN,
  },
});

const API_DOMAIN: string =
  "https://api-project-product-management.vercel.app/api";

// const API_DOMAIN: string = "http://192.168.143.42:5000/api";

export const get = async (
  path: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const response = await axios.get(API_DOMAIN + path, config);
  return response;
};

export const post = async <U>(
  path: string,
  config: AxiosRequestConfig,
  params?: U
): Promise<AxiosResponse> => {
  const response = await axios.post(API_DOMAIN + path, params, config);
  return response;
};

export const patch = async <U>(
  path: string,
  config: AxiosRequestConfig,
  params?: U
): Promise<AxiosResponse> => {
  const response = await axios.patch(API_DOMAIN + path, params, config);
  return response;
};

export const deleteRequest = async (
  path: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const response = await axios.delete(API_DOMAIN + path, config);
  return response;
};
