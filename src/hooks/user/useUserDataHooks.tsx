import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";
import { IGETUserDataQuery, IGETUserDataResponse, IGetAllUserResponse, IUserDataQueryType } from "./IGetUserDataHooks.interface";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/common/libs/axios/api";
import { userEndPoint } from "./userDataEndPoint";
import { IUser } from "@/common/types/user/user.interface";
import { IPUTUserBody, IPUTUserDataQueryType } from "./IPutUserDataHooks.interface";
import { AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { IGETCompanyRosterResponse, IRequestsGetAllResponse } from "../company/IGetCompanyDataHooks.interface";
import { IPOSTUserBody, IPOSTUserDataQueryType, IPOSTUserDataRerturn } from "./IPostUserDataHooks.interface";
import { IDELETEUserDataBody, IDELETEUserDataQueryType } from "./IDeleteUserDataHooks.interface";

export interface IUseGETUserDataHooks {
    query: IUserDataQueryType
    keepParmas?: boolean
    defaultParams?: IGETUserDataQuery
    UseQueryOptions?: UseQueryOptions<
        IGETUserDataResponse,
        unknown,
        IGETUserDataResponse,
        [string, IGETUserDataQuery]>
}

export function useGETUserDataHooks({
    query,
    keepParmas,
    defaultParams,
    UseQueryOptions,
}: IUseGETUserDataHooks) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const queryParams = searchParams?.get('query')

    const [GETUserDataParams, setGETUserDataParams] = useState<IGETUserDataQuery>(
        (keepParmas && JSON.parse(queryParams as string)) || defaultParams || {}
    );

    const {
        data,
        error,
        isLoading,
        refetch,
        isFetching
    } = useQuery<
        IGETUserDataResponse,
        unknown,
        IGETUserDataResponse,
        [string, IGETUserDataQuery]
    >(
        ["UserData", GETUserDataParams],
        async () => {
            const response = await api.get<IGETUserDataResponse>(userEndPoint[query].url, {
                params: GETUserDataParams,
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
            replace(`${pathname}?query=${JSON.stringify(GETUserDataParams)}`);
        }
    }, [GETUserDataParams, keepParmas, pathname, replace]);


    return {
        userDetails: data as IUser,
        allUsers: data as IGetAllUserResponse,
        userAllRoster: data as IGETCompanyRosterResponse,
        userAllRequests: data as IRequestsGetAllResponse,

        userDataError: error ? true : false,
        isUserDataLoading: isLoading,
        refetchUserData: refetch,
        isUserDataFetching: isFetching,
        GETUserDataParams,
        setGETUserDataParams,
    };
}


export interface IUsePOSTUserDataHooks {
    query: IPOSTUserDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPOSTUserBody>
    toToast?: boolean
    toRefetch?: () => void
}

export function usePOSTUserDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toToast = true,
    toRefetch
}: IUsePOSTUserDataHooks) {
    const { mutate, isLoading, data } = useMutation(
        async (data: IPOSTUserBody) => {
            const response = await api.post<IPOSTUserDataRerturn>(`${userEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toToast && toast.success(userEndPoint[query].createSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || userEndPoint[query].createError)
            },
            ...UseMutationOptions,
        }
    )


    return {
        createUserData: mutate,
        isCreateUserDataLoading: isLoading,
        createUserDataResponse: data
    };
}


export interface IUsePutUserDataHooks {
    query: IPUTUserDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPUTUserBody>
    toRefetch?: () => void
}

export function usePUTUserDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUsePutUserDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IPUTUserBody) => {
            const response = await api.put<any>(`${userEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: () => {
                toRefetch && toRefetch()
                toast.success(userEndPoint[query].updateSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || userEndPoint[query].updateError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        updateuserData: mutate,
        isUpdateuserDataLoading: isLoading,
    };
}

export interface IUseDELETEUserDataHooks {
    query: IDELETEUserDataQueryType
    AxiosRequestConfig?: AxiosRequestConfig
    UseMutationOptions?: UseMutationOptions<void, unknown, IDELETEUserDataBody>
    toRefetch?: () => void
}


export function useDELETEUserDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUseDELETEUserDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IDELETEUserDataBody) => {
            const response = await api.delete<void>(
                userEndPoint[query].url,
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
                toast.success(userEndPoint[query].deleteSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || userEndPoint[query].deleteError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        deleteUserData: mutate,
        isDeleteUserDataLoading: isLoading,
    };
}

