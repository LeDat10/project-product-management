import { AxiosRequestConfig, AxiosResponse } from "axios";
import { get, post } from "../utils/request";

interface Info {
  fullName: string;
  phone: string;
  address: string;
}

export const postOrder = async (
  config: AxiosRequestConfig = {},
  userinfo: Info
): Promise<AxiosResponse> => {
  const response = await post("/order/confirm", config, { userInfo: userinfo });
  return response;
};

export const getPayment = async (
  orderId: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await get(`/order/payment-data/${orderId}`, config);
  return response;
};

export const postPayment = async (
  orderId: string,
  money: number | undefined,
  hmac: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await post("/order/payment", config, {
    orderId: orderId,
    amount: money,
    hmac: hmac,
  });
  return response;
};

export const getListOrder = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const response = await get("/order", config);
  return response;
};
