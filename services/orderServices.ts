import { AxiosRequestConfig, AxiosResponse } from "axios";
import { post } from "../utils/request";

interface Info {
  fullName: string;
  number: string;
  address: string;
  email: string;
}

export const postOrder = async (
  config: AxiosRequestConfig = {},
  userinfo: Info
): Promise<AxiosResponse> => {
  const response = await post("/order/confirm", config, userinfo);
  return response;
};
