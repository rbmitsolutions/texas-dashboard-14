import { AxiosResponse } from "axios";
import { getApiClient } from "./axios";
import { destroyCookie, setCookie } from "nookies";

//interfaces
import { getAuthToken } from "@/common/utils/tokens";
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

export const api = getApiClient();

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    if (error.response.status === 401) {
      if (error.response.data?.message === "Invalid Token") {
        const token = getAuthToken();

        const originalConfig = error.config;
        if (!isRefreshing) {
          isRefreshing = true;
          api
            .post(
              `${EndPointsTypes['AUTH_ENDPOINT_REFRESH_TOKEN']}`, {
              data: {
                refreshToken: { id: token?.refresh_token?.id }
              }
            }
            )
            .then(({ data }) => {
              setCookie(
                null,
                process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY! as string,
                JSON.stringify({
                  user_id: token?.user_id,
                  name: token?.name,
                  profile_image: token?.profile_image,
                  permissions: token?.permissions,
                  token: data.token,
                  refresh_token: { ...data.refresh_token },
                }),
                {
                  path: "/",
                  maxAge: 24 * 60 * 60, //1day
                }
              );
              api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(data.token)
              );
              failedRequestsQueue = [];
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onFailure(err));
              failedRequestsQueue = [];
              if (typeof window !== "undefined") {
                destroyCookie({}, process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string, {
                  path: "/",
                });
                //redirect to signin
                window.location.href = "/signin"


                // Router.push("/admin");
              }
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: any) => {
              reject(err);
            },
          });
        });
      } else {
        if (typeof window !== "undefined") {
          destroyCookie({}, process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string, {
            path: "/",
          });
          window.location.href = "/signin"
          // Router.push("/admin");
        }
      }
    }

    return Promise.reject(error);
  }
);
