import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";
import { companyEndPoint } from "./companyDataEndPoint";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

//libs
import { api } from "@/common/libs/axios/api";

//interface
import { ICompanyAllFormsDataReponse, ICompanyDataQueryType, IFormSectionGetAllResponse, IFormsGetAllResponse, IGETCompanyDataQuery, IGETCompanyResponse, IGETCompanyRosterResponse, IHaccpReportsResponse } from "./IGetCompanyDataHooks.interface";
import { IDELETECompanyDataBody, IDELETECompanyDataQueryType } from "./IDeleteCompanyDataHooks.interface";
import { IPOSTCompanyBody, IPOSTCompanyDataQueryType } from "./IPostCompanyDataHooks.interface";
import { IPUTCompanyBody, IPUTCompanyDataQueryType } from "./IPutCompanyDataHooks.interface";
import { IForm, IFormData, IFormSection } from "@/common/types/company/form.interface";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";

interface IUseGETCompanyDataHooks {
    query: ICompanyDataQueryType,
    keepParmas?: boolean
    defaultParams?: IGETCompanyDataQuery,
    UseQueryOptions?: UseQueryOptions<
        IGETCompanyResponse,
        unknown,
        IGETCompanyResponse,
        [string, IGETCompanyDataQuery]
    >
}

export function useGETCompanyDataHooks({
    query,
    keepParmas = false,
    defaultParams,
    UseQueryOptions,
}: IUseGETCompanyDataHooks) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const queryParams = searchParams?.get('query')


    const [GETCompanyDataParams, setGETCompanyDataParams] = useState<IGETCompanyDataQuery>(
        (keepParmas && JSON.parse(queryParams as string)) || defaultParams || {}
    );

    const {
        data,
        error,
        isLoading,
        refetch,
        isFetching
    } = useQuery<
        IGETCompanyResponse,
        unknown,
        IGETCompanyResponse,
        [string, IGETCompanyDataQuery]
    >(
        ["CompanyData", GETCompanyDataParams],
        async () => {
            const response = await api.get<IGETCompanyResponse>(companyEndPoint[query].url, {
                params: GETCompanyDataParams,
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
            replace(`${pathname}?query=${JSON.stringify(GETCompanyDataParams)}`);
        }
    }, [GETCompanyDataParams, keepParmas, pathname, replace]);

    return {
        companyRoster: data as IGETCompanyRosterResponse,
        companyAllHaccpReports: data as IHaccpReportsResponse,
        companyHaccpReport: data as IHaccpReports,
        companyAllForms: data as IFormsGetAllResponse,
        companyForm: data as IForm,
        companyAllFormSection: data as IFormSectionGetAllResponse,
        companyFormSaction: data as IFormSection,
        companyAllFormData: data as ICompanyAllFormsDataReponse,
        companyFormData: data as IFormData,

        isCompanyDataFetching: isFetching,
        companyDataError: error ? true : false,
        isCompanyDataLoading: isLoading,
        refetchCompanyData: refetch,
        GETCompanyDataParams,
        setGETCompanyDataParams,
    };
}


export function usePOSTCompanyDataHooks(
    query: IPOSTCompanyDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPOSTCompanyBody>
) {
    // const { errorToast, successToast } = useToastHooks()

    const { mutate, isLoading } = useMutation(
        async (data: IPOSTCompanyBody) => {
            const response = await api.post<any>(`${companyEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: () => {
                // successToast(companyEndPoint[query].createSucess)
            },
            onError: (error) => {
                // errorToast(error || companyEndPoint[query].createError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        createCompanyData: mutate,
        isCreateCompanyDataLoading: isLoading,
    };
}


export function usePUTCompanyDataHooks(
    query: IPUTCompanyDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPUTCompanyBody>
) {
    // const { errorToast, successToast } = useToastHooks()

    const { mutate, isLoading } = useMutation(
        async (data: IPUTCompanyBody) => {
            const response = await api.put<any>(`${companyEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: () => {
                // successToast(companyEndPoint[query].updateSucess)
            },
            onError: (error) => {
                // errorToast(error || companyEndPoint[query].updateSucess)
            },
            ...UseMutationOptions,
        }
    );

    return {
        updateCompanyData: mutate,
        isUpdateCompanyDataLoading: isLoading,
    };
}


export function useDELETECompanyDataHooks(
    query: IDELETECompanyDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<void, unknown, IDELETECompanyDataBody>
) {
    // const { errorToast, successToast } = useToastHooks()

    const { mutate, isLoading } = useMutation(
        async (data: IDELETECompanyDataBody) => {
            const response = await api.delete<void>(
                companyEndPoint[query].url,
                {
                    params: data,
                    ...AxiosRequestConfig,
                }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                // successToast(companyEndPoint[query].deleteSucess)
            },
            onError: (error) => {
                // errorToast(error || companyEndPoint[query].deleteError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        deleteCompanyData: mutate,
        isDeleteCompanyDataLoading: isLoading,
    };
}

