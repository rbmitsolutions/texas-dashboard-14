import { TexasHooksContext } from "@/context/texasContext/TexasContext";
import { useContext } from "react";

export function useTexasHooks() {
  return useContext(TexasHooksContext);
}
