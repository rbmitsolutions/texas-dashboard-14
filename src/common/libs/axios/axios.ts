import { IToken } from "@/common/types/auth/auth.interface";
import { getAuthToken } from "@/common/utils/tokens";
import axios from "axios";

//todo: remove ctx
export function getApiClient(ctx?: any) {
  const token: IToken | null = getAuthToken();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token.token}`;
  }
  return api;
}
