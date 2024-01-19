'use client'
import { createContext, ReactNode, useState, useEffect } from "react";

//utils
import { handleSignResponse } from "./utils/handleSignResponse";
import { IPOSTAuthSignInBody, postSignInData } from "./utils/postSignInData";
import { IPOSTAuthSignUpBody, postSignUpData } from "./utils/postSignUpData";

//interface
import { getAuthToken, setAuthHeader } from "@/common/utils/tokens";
import { IToken } from "@/common/types/auth/auth.interface";

interface IAuthHooks {
  isLoading: boolean;
  handleSignIn: (data: IPOSTAuthSignInBody['data']['auth']) => Promise<IToken>;
  handleSingUp: (data: IPOSTAuthSignUpBody['data']['create']) => void;
  user: IToken;
  setUser: (user: IToken) => void;
  setIsLoading: (x: boolean) => void;
}

interface IAuthHooksProvider {
  children: ReactNode;
}
export const AuthHooksContext = createContext({} as IAuthHooks);

export function AuthHooksContextProvider({ children }: IAuthHooksProvider) {
  const [user, setUser] = useState<IToken>({} as IToken);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async (data: IPOSTAuthSignInBody['data']['auth']): Promise<IToken> => {
    setIsLoading(true);
    try {
      const response = await postSignInData(data);
      await handleSignResponse(response)
      setUser(response);
      setIsLoading(false);
      return response;
    } catch (err: any) {
      setIsLoading(false);
      throw Error(err?.response?.data?.message);
    }
  }

  async function handleSingUp(data: IPOSTAuthSignUpBody['data']['create']) {
    setIsLoading(true);
    try {
      await postSignUpData(data);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      throw Error(err?.response?.data?.message);
    }
  }

  useEffect(() => {
    const token: IToken | null = getAuthToken();
    if (token) {
      setUser(token);
      setAuthHeader(token.token);
    }
  }, []);

  return (
    <AuthHooksContext.Provider
      value={{
        isLoading,
        setIsLoading,
        user,
        setUser,
        handleSignIn,
        handleSingUp,
      }}
    >
      {children}
    </AuthHooksContext.Provider>
  );
}
