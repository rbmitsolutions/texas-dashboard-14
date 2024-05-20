import React from "react";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./theme";
import { AuthHooksContextProvider } from "@/context/auth/AuthContext";
import ReactQueryProvider from "./react-query";

export const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="umbrsoft-theme"
    >
      <ReactQueryProvider>
        <AuthHooksContextProvider>
          {children}
          <Toaster />
        </AuthHooksContextProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

