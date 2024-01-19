import { api } from "@/common/libs/axios/api";
import { IToken } from "@/common/types/auth/auth.interface";
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

export interface IPOSTAuthSignUpBody {
  data: {
    create?: {
      name: string
      email: string
      role_id: string
      visa_needed: boolean
      commencement_date: Date
      fixed_salary: boolean
      rate_per_hour: string
      rate_per_hour_weekend: string
      salary: string
      file: string
    },
    refreshToken?: {
      id: string
    }
  };
}

export const postSignUpData = async (data: IPOSTAuthSignUpBody['data']['create']) => {
  await api.post<IToken>(EndPointsTypes['AUTH_ENDPOINT_SIGNIN'], {
    data: {
      create: data
    }
  });
};
