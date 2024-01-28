import { IToken } from "@/common/types/auth/auth.interface";
import { setAuthHeader } from "@/common/utils/tokens";
import { setCookie } from "nookies";

//todo:
// import { cookies } from 'next/headers'

export const handleSignResponse = async (response: IToken) => {
  console.log(1)
  await setCookie(
    null,
    process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string,
    JSON.stringify(response),
    {
      maxAge: 24 * 60 * 60, //1day
      path: "/",
    }
    );
    console.log(2)
    setAuthHeader(response.token);
    console.log(3)
  return;
};
