import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/common/libs/axios/api";
import { restaurantEndPoint } from "./restaurantDataEndPoint";
import { IAllAuthorizedDevicesResponse, IAllOrderControllerResponse, IAllOrdersResponse, IFinishedTableAllResponse, IGETAllBookingsResponse, IGETAllReviewsResponse, IGETMenuAddOnsResponse, IGETMenuSectionsResponse, IGETMenuTypesResponse, IGETPrintersResponse, IGETRestaurantDataQuery, IGETRestaurantResponse, IGETTablesAllResponse, IGetAllClientsResponse, IGiftCardReponse, IGETMenuResponse, IOpenDaysGetAllResponse, IRestaurantDataQueryType, IGETMenuOrderSystemResponse, IGETSectionResponse, ITimesOpenWebsiteConfigResponse, IBookingPageResponse, IAllSpecialDaysResponse } from "./IGetRestaurantDataHooks.interface";
import { IPOSTRestaurantBody, IPOSTRestaurantDataQueryType, IPOSTRestaurantDataRerturn } from "./IPostRestaurantDataHooks.interface";
import { IPUTRestaurantBody, IPUTRestaurantDataQueryType } from "./IPutRestaurantDataHooks.interface";
import { IDELETERestaurantDataBody, IDELETERestaurantDataQueryType } from "./IDeleteRestaurantDataHooks.interface";
import { IBookings, IReviews } from "@/common/types/restaurant/bookings.interface";
import { IFinishedTable, ITable } from "@/common/types/restaurant/tables.interface";
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface";
import { IClient } from "@/common/types/restaurant/client.interface";
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { IAuthorizedDevices } from "@/common/types/restaurant/authorizedDevices.interface";
import { IMenu } from "@/common/types/restaurant/menu.interface";
import { IBookingDays, ITimesOpen } from "@/common/types/restaurant/config.interface";

interface IUseGETRestaurantDataHooks {
    query: IRestaurantDataQueryType,
    keepParmas?: boolean
    defaultParams?: IGETRestaurantDataQuery,
    UseQueryOptions?: UseQueryOptions<
        IGETRestaurantResponse,
        unknown,
        IGETRestaurantResponse,
        [string, IGETRestaurantDataQuery]
    >
}

export function useGETRestaurantDataHooks({
    query,
    keepParmas = false,
    defaultParams,
    UseQueryOptions,
}: IUseGETRestaurantDataHooks) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const queryParams = searchParams?.get('query')

    const [GETRestaurantDataParams, setGETRestaurantDataParams] = useState<IGETRestaurantDataQuery>(
        (keepParmas && JSON.parse(queryParams as string)) || defaultParams || {}
    );

    const {
        data,
        error,
        isLoading,
        refetch,
        isFetching
    } = useQuery<
        IGETRestaurantResponse,
        unknown,
        IGETRestaurantResponse,
        [string, IGETRestaurantDataQuery]
    >(
        ["RestaurantData", GETRestaurantDataParams],
        async () => {
            const response = await api.get<IGETRestaurantResponse>(restaurantEndPoint[query].url, {
                params: GETRestaurantDataParams,
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
            replace(`${pathname}?query=${JSON.stringify(GETRestaurantDataParams)}`);
        }
    }, [GETRestaurantDataParams, keepParmas, pathname, replace]);

    return {
        restaurantAllBookings: data as IGETAllBookingsResponse,
        restaurantBooking: data as IBookings,
        restaurantBookingAnalytics: data as any,
        restaurantAllTables: data as IGETTablesAllResponse,
        restaurantTable: data as ITable,
        restaurantAllOrders: data as IAllOrdersResponse,
        restaurantOrder: data as IOrder,
        restaurantOrdersAnalytics: data as any,
        restaurantAllOrderController: data as IAllOrderControllerResponse,
        restaurantOrderController: data as IOrderController,
        restaurantOrderAnalytics: data as any,
        restaurantAllClients: data as IGetAllClientsResponse,
        restaurantClient: data as IClient,
        restaurantAllFinishedTables: data as IFinishedTableAllResponse,
        restaurantFinishedTable: data as IFinishedTable,
        restaurantFinishedTableAnalytics: data as any,
        restaurantAllReviews: data as IGETAllReviewsResponse,
        restaurantReview: data as IReviews,
        restaurantAllGiftCards: data as IGiftCardReponse,
        restaurantGiftCard: data as IGiftCards,
        restaurantAllAuthorizedDevices: data as IAllAuthorizedDevicesResponse,
        restaurantAuthorizedDevice: data as IAuthorizedDevices,
        restaurantAllOpenDays: data as IOpenDaysGetAllResponse,
        restaurantOpenDay: data as IBookingDays,
        restaurantAllSections: data as IGETSectionResponse,
        restaurantAllPrinters: data as IGETPrintersResponse,
        restaurantAllMenuSections: data as IGETMenuSectionsResponse,
        restaurantAllMenuTypes: data as IGETMenuTypesResponse,
        restaurantAllMenuAddOns: data as IGETMenuAddOnsResponse,
        restaurantAllMenu: data as IGETMenuResponse,
        restaurantMenu: data as IMenu,
        restaurantMenuOrderSystem: data as IGETMenuOrderSystemResponse[],
        restaurantWebsiteTimeConfig: data as ITimesOpenWebsiteConfigResponse[],
        restaurantBookingPageData: data as IBookingPageResponse,
        restaurantAllSpecialDays: data as IAllSpecialDaysResponse,
        restuarantTimesOpen: data as ITimesOpen[],

        isRestaurantDataFetching: isFetching,
        restaurantDataError: error ? true : false,
        isRestaurantDataLoading: isLoading,
        refetchRestaurantData: refetch,
        GETRestaurantDataParams,
        setGETRestaurantDataParams,
    };
}

export interface IUsePOSTRestaurantDataHooks {
    query: IPOSTRestaurantDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPOSTRestaurantBody>
    toToast?: boolean
    toRefetch?: () => void
}

export function usePOSTRestaurantDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toToast = true,
    toRefetch
}: IUsePOSTRestaurantDataHooks) {
    const { mutate, isLoading, data } = useMutation(
        async (data: IPOSTRestaurantBody) => {
            const response = await api.post<IPOSTRestaurantDataRerturn>(`${restaurantEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toToast && toast.success(restaurantEndPoint[query].createSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || restaurantEndPoint[query].createError)
            },
            ...UseMutationOptions,
        }
    )


    return {
        createRestaurantData: mutate,
        isCreateRestaurantDataLoading: isLoading,
        createRestaurantDataResponse: data
    };
}

export interface IUsePutRestaurantDataHooks {
    query: IPUTRestaurantDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPUTRestaurantBody>
    toRefetch?: () => void
}

export function usePUTRestaurantDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUsePutRestaurantDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IPUTRestaurantBody) => {
            const response = await api.put<any>(`${restaurantEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toast.success(restaurantEndPoint[query].updateSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || restaurantEndPoint[query].updateError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        updateRestaurantData: mutate,
        isUpdateRestaurantDataLoading: isLoading,
    };
}

export interface IUseDELETERestaurantDataHooks {
    query: IDELETERestaurantDataQueryType
    AxiosRequestConfig?: AxiosRequestConfig
    UseMutationOptions?: UseMutationOptions<void, unknown, IDELETERestaurantDataBody>
    toRefetch?: () => void
}

export function useDELETERestaurantDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUseDELETERestaurantDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IDELETERestaurantDataBody) => {
            const response = await api.delete<void>(
                restaurantEndPoint[query].url,
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
                toast.success(restaurantEndPoint[query].deleteSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || restaurantEndPoint[query].deleteError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        deleteRestaurantData: mutate,
        isDeleteRestaurantDataLoading: isLoading,
    };
}

