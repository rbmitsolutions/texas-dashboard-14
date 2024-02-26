import { parseCookies } from "nookies";
import { api } from "../libs/axios/api";

//interfaces
import { IToken } from "../types/auth/auth.interface";

export function getAuthToken(): IToken | null {
  const data = parseCookies();

  const tokenKey: string = process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY! as string;
  if (data && data[tokenKey]) {
    try {
      JSON.parse(data[tokenKey]);
    } catch (e) {
      return null;
    }
    return JSON.parse(data[tokenKey]);
  }
  return null;
}

export function setAuthHeader(token: string) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}
