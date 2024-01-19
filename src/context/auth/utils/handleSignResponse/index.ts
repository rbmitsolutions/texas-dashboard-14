import { IToken } from "@/common/types/auth/auth.interface";
import { setAuthHeader } from "@/common/utils/tokens";
import { setCookie } from "nookies";

//todo:
// import { cookies } from 'next/headers'

export const handleSignResponse = async (response: IToken) => {
  await setCookie(
    null,
    process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string,
    JSON.stringify(response),
    {
      maxAge: 24 * 60 * 60, //1day
      path: "/",
    }
  );
  setAuthHeader(response.token);
  //todo: redirect to admin
  // redirectTo("/admin/roster");
  return;
};
