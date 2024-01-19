import { AuthHooksContext } from "@/context/auth/AuthContext";
import { useContext } from "react";

export function useAuthHooks() {
  return useContext(AuthHooksContext);
}
