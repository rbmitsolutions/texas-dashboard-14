import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";
import { companyEndPoint } from "./companyDataEndPoint";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

//libs
import { api } from "@/common/libs/axios/api";

//interface
import { ICompanyAllFormsDataReponse, ICompanyDataQueryType, ICompanyDetailsResponse, IFormSectionGetAllResponse, IFormsGetAllResponse, IGETAllDepartamentsResponse, IGETAllDutiesResponse, IGETAllShiftsResponse, IGETCompanyAllFilesResponse, IGETCompanyDataQuery, IGETCompanyResponse, IGETCompanyRosterResponse, IGETRolesResponse, IHaccpReportsResponse, IRequestsGetAllResponse } from "./IGetCompanyDataHooks.interface";
import { IDELETECompanyDataBody, IDELETECompanyDataQueryType } from "./IDeleteCompanyDataHooks.interface";
import { IPOSTCompanyBody, IPOSTCompanyDataQueryType, IPOSTCompanyDataRerturn } from "./IPostCompanyDataHooks.interface";
import { IPUTCompanyBody, IPUTCompanyDataQueryType } from "./IPutCompanyDataHooks.interface";
import { IForm, IFormData, IFormSection } from "@/common/types/company/form.interface";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";
import { IFiles } from "@/common/types/company/files.interface";
import { IRequests } from "@/common/types/company/requests.interface";
import { IRoles } from "@/common/types/company/companyDetails.interface";
import { IDepartaments } from "@/common/types/company/departaments.interface";

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
        companyAllRoster: data as IGETCompanyRosterResponse,
        companyAllHaccpReports: data as IHaccpReportsResponse,
        companyHaccpReport: data as IHaccpReports,
        companyAllForms: data as IFormsGetAllResponse,
        companyForm: data as IForm,
        companyAllFormSection: data as IFormSectionGetAllResponse,
        companyFormSaction: data as IFormSection,
        companyAllFormData: data as ICompanyAllFormsDataReponse,
        companyFormData: data as IFormData,
        companyAllFiles: data as IGETCompanyAllFilesResponse,
        compnayFileData: data as IFiles,
        companyAllRequests: data as IRequestsGetAllResponse,
        companyRequest: data as IRequests,
        companyDetails: data as ICompanyDetailsResponse,
        companyAllRoles: data as IGETRolesResponse,
        companyRole: data as IRoles,
        companyAllDepartaments: data as IGETAllDepartamentsResponse,
        companyDepartament: data as IDepartaments,
        companyAllShifts: data as IGETAllShiftsResponse,
        companyAllDuties: data as IGETAllDutiesResponse,

        isCompanyDataFetching: isFetching,
        companyDataError: error ? true : false,
        isCompanyDataLoading: isLoading,
        refetchCompanyData: refetch,
        GETCompanyDataParams,
        setGETCompanyDataParams,
    };
}

export interface IUsePOSTCompanyDataHooks {
    query: IPOSTCompanyDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPOSTCompanyBody>
    toToast?: boolean
    toRefetch?: () => void
}

export function usePOSTCompanyDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toToast = true,
    toRefetch
}: IUsePOSTCompanyDataHooks) {
    const { mutate, isLoading, data } = useMutation(
        async (data: IPOSTCompanyBody) => {
            const response = await api.post<IPOSTCompanyDataRerturn>(`${companyEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toToast && toast.success(companyEndPoint[query].createSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || companyEndPoint[query].createError)
            },
            ...UseMutationOptions,
        }
    )


    return {
        createCompanyData: mutate,
        isCreateCompanyDataLoading: isLoading,
        createCompanyDataResponse: data
    };
}

export interface IUsePutCompanyDataHooks {
    query: IPUTCompanyDataQueryType,
    AxiosRequestConfig?: AxiosRequestConfig,
    UseMutationOptions?: UseMutationOptions<any, unknown, IPUTCompanyBody>
    toRefetch?: () => void
}

export function usePUTCompanyDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUsePutCompanyDataHooks) {

    const { mutate, isLoading } = useMutation(
        async (data: IPUTCompanyBody) => {
            const response = await api.put<any>(`${companyEndPoint[query].url}`, {
                data,
                ...AxiosRequestConfig,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                toRefetch && toRefetch()
                toast.success(companyEndPoint[query].updateSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || companyEndPoint[query].updateError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        updateCompanyData: mutate,
        isUpdateCompanyDataLoading: isLoading,
    };
}

export interface IUseDELETECompanyDataHooks {
    query: IDELETECompanyDataQueryType
    AxiosRequestConfig?: AxiosRequestConfig
    UseMutationOptions?: UseMutationOptions<void, unknown, IDELETECompanyDataBody>
    toRefetch?: () => void
}

export function useDELETECompanyDataHooks({
    query,
    AxiosRequestConfig,
    UseMutationOptions,
    toRefetch
}: IUseDELETECompanyDataHooks) {

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
                toRefetch && toRefetch()
                toast.success(companyEndPoint[query].deleteSucess)
            },
            onError: (error: any) => {
                toast.error(error.response.data.message || companyEndPoint[query].deleteError)
            },
            ...UseMutationOptions,
        }
    );

    return {
        deleteCompanyData: mutate,
        isDeleteCompanyDataLoading: isLoading,
    };
}

