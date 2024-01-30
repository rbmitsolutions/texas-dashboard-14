import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { ReactNode, createContext, useState } from "react";
// import { io } from "socket.io-client";
import { useEnableFetch } from "./utils/config";
import { IMenu } from "@/common/types/restaurant/menu.interface";

interface IConfigProvider {
    children: ReactNode
}

interface ITexasReducer {
    // sections: ISection[];
    // order: IOrderState;
    // orderDispatch: Dispatch<IOrderAction>;
    // tables: ITableState;
    // tableDispatch: Dispatch<ITableAction>;
    // menu: IMenuState;
    // menuDispatch: Dispatch<IMenuAction>;
    // orderController: IOrderController[];
    // tableInfo: (id: string) => { table: ITable | undefined, orderController: IOrderController[] | [], transactions: ITableTransactionsReturn }
}

// const socket = io(process.env.NEXT_PUBLIC_BACKEND_API! as string);

export const TexasHooksContext = createContext({} as ITexasReducer);

export function TexasHooksContextProvider({ children }: IConfigProvider) {



    return (
        <TexasHooksContext.Provider value={{ 
         }}>
            {children}
        </TexasHooksContext.Provider>
    )
}