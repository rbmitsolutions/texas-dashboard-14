'use client'
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stockEndPoint } from "./stockDataEndPoint";
import { api } from "@/common/libs/axios/api";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

//interfaces
import { IGETAllIStockItemResponse, IGETAllIStockSuppliersResponse, IGETAllStockSupplierAutoOrderResponse, IGETAllStockSupplierBankResponse, IGETAllStockSupplierContactsResponse, IGETStockDataQuery, IGETStockResponse, IStockDataQueryType } from "./IGetStockDataHooks.interface";
import { IPOSTStockBody, IPOSTStockDataQueryType, IPOSTStockDataRerturn } from "./IPostStockDataHooks.interface";
import { IDELETEStockDataBody, IDELETEStockDataQueryType } from "./IDeleteStockDataHooks.interface";
import { IPUTStockBody, IPUTStockDataQueryType } from "./IPutStockDataHooks.interface";
import { IStockItem, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface";

interface IUseGETStockDataHooks {
    query: IStockDataQueryType,
    keepParmas?: boolean
    defaultParams?: IGETStockDataQuery,
    UseQueryOptions?: UseQueryOptions<
        IGETStockResponse,
        unknown,
        IGETStockResponse,
        [string, IGETStockDataQuery]
    >
}

export function useGETStockDataHooks({
    query,
    keepParmas = false,
    defaultParams,
    UseQueryOptions,
}: IUseGETStockDataHooks) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const queryParams = searchParams?.get('query')

    const [GETStockDataParams, setGETStockDataParams] = useState<IGETStockDataQuery>(
        (keepParmas && JSON.parse(queryParams as string)) || defaultParams || {}
    );

    const {
        data,
        error,
        isLoading,
        refetch,
        isFetching
    } = useQuery<
        IGETStockResponse,
        unknown,
        IGETStockResponse,
        [string, IGETStockDataQuery]
    >(
        ["StockData", GETStockDataParams],
        async () => {
            const response = await api.get<IGETStockResponse>(stockEndPoint[query].url, {
                params: GETStockDataParams,
            });

            return response.data
        },
        {
            refetchOnWindowFocus: false,
            ...UseQueryOptions,
        }
    );

    useEffect(() => {
        if (keepParmas) {
            replace(`${pathname}?query=${JSON.stringify(GETStockDataParams)}`);
        }
    }, [GETStockDataParams, keepParmas, pathname, replace]);

    return {
        stockAllSuppliers: data as IGETAllIStockSuppliersResponse,
        stockSupplier: data as IStockSuppliers,
        stockSupplierBank: data as IGETAllStockSupplierBankResponse,
        supplierBank:data as IStockSupplierBank,
        stockAllItem: data as IGETAllIStockItemResponse,
        stockItem: data as IStockItem,
        stockAllContacts: data as IGETAllStockSupplierContactsResponse,
        stockContacts: data as IStockSupplierContacts,
        stockAllAutoOrder: data as IGETAllStockSupplierAutoOrderResponse,
        stockAutoOrder: data as IStockSupplierAutoOrder,

        isStockDataFetching: isFetching,
        stockDataError: error ? true : false,
        isStockDataLoading: isLoading,
        refetchStockData: refetch,
        GETStockDataParams,
        setGETStockDataParams,
    };
}

export interface IUsePOSTStockDataHooks {
    query: IPOSTStockDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPOSTStockBody>
    toToast?: boolean
    toRefetch?: () => void
}

export function usePOSTStockDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toToast = true,
    toRefetch
}: IUsePOSTStockDataHooks) {
    const { mutate, isLoading, data } = useMutation(
        async (data: IPOSTStockBody) => {
            const response = await api.post<IPOSTStockDataRerturn>(`${stockEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toToast && toast.success(stockEndPoint[query].createSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || stockEndPoint[query].createError)
            },
            ...UseMutationOptions,
        }
    )


    return {
        createStockData: mutate,
        isCreateStockDataLoading: isLoading,
        createStockDataResponse: data
    };
}

export interface IUsePutStockDataHooks {
    query: IPUTStockDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPUTStockBody>
    toRefetch?: () => void
}

export function usePUTStockDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUsePutStockDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IPUTStockBody) => {
            const response = await api.put<any>(`${stockEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toast.success(stockEndPoint[query].updateSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || stockEndPoint[query].updateError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        updateStockData: mutate,
        isUpdateStockDataLoading: isLoading,
    };
}

export interface IUseDELETEStockDataHooks {
    query: IDELETEStockDataQueryType
    AxiosRequestConfig?: AxiosRequestConfig
    UseMutationOptions?: UseMutationOptions<void, unknown, IDELETEStockDataBody>
    toRefetch?: () => void
}

export function useDELETEStockDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUseDELETEStockDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IDELETEStockDataBody) => {
            const response = await api.delete<void>(
                stockEndPoint[query].url,
                {
                    params: data,
                    ...AxiosRequestConfig,
                }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                toRefetch && toRefetch()
                toast.success(stockEndPoint[query].deleteSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || stockEndPoint[query].deleteError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        deleteStockData: mutate,
        isDeleteStockDataLoading: isLoading,
    };
}

