import { api } from "@/common/libs/axios/api";
import { IToken } from "@/common/types/auth/auth.interface";
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

export interface IPOSTAuthSignInBody {
  data: {
    auth?: {
      email: string;
      password: string;
    };
    byRosterPassword?: {
      rosterPassword: string;
    };
    clockIn?: {
      roster_password: string;
    };
  };
}

export const postSignInData = async (data: IPOSTAuthSignInBody['data']['auth']) => {
  const response = await api.post<IToken>(EndPointsTypes['AUTH_ENDPOINT_SIGNIN'], {
    data: {
      auth: {
        email: data?.email,
        password: data?.password,
      },
    },
  });
  return response.data;
};
