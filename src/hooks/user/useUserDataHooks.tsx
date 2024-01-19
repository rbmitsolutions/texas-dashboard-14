// import { useState } from "react";
// import { AxiosRequestConfig } from "axios";
// import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";

// //libs
// import { api } from "@/common/libs/axios/api";

// //config
// import { USER_ANALYTICS_ENDPOINT, USER_CONTRACT_ENDPOINT, USER_DOCUMENTS_ENDPOINT, USER_ENDPOINT, USER_HACCP_ENDPOINT, USER_PAYMENTS_ENDPOINT, USER_PERFORMANCE_ENDPOINT, USER_PROFILE_COMPLETED_ENDPOINT, USER_REQUEST_ENDPOINT, USER_REVIEWS_ENDPOINT, USER_ROSTER_ENDPOINT } from "@config/apiEndPoints";

// //interface
// import { IUser } from "@interfaces/user";
// import { IDELETEUserBody, IDELETEUserDataQueryType, IGETUserCompletedProfileResponse, IGETUserDataQuery, IGETUserPaymentAnalyticsResponse, IGETUserPerformanceResponse, IGETUserRequestsResponse, IGETUserResponse, IGETUserReviewsResponse, IGETUserRosterAnalyticsResponse, IPOSTUserBody, IPOSTUserDataQueryType, IPUTUserBody, IPUTUserDataQueryType, IUserDataQueryType } from "./iuserDataHooks.interfaces";
// import { IPayments } from "@interfaces/company";
// import { IGETCompanyRosterResponse } from "@hooks/company/IGetCompanyDataHooks.interface";


// export function useGETUserDataHooks(
//   query: IUserDataQueryType,
//   defaultParams?: IGETUserDataQuery,
//   UseQueryOptions?: UseQueryOptions<
//     IGETUserResponse,
//     unknown,
//     IGETUserResponse,
//     [string, IGETUserDataQuery]
//   >
// ) {
//   const [GETUserDataParams, setGETUserDataParams] = useState<IGETUserDataQuery>(
//     defaultParams ?? {}
//   );

//   const endPoint = {
//     USER: USER_ENDPOINT,
//     PERFORMANCE: USER_PERFORMANCE_ENDPOINT,
//     REVIEWS: USER_REVIEWS_ENDPOINT,
//     REQUESTS: USER_REQUEST_ENDPOINT,
//     PROFILE_COMPLETED: USER_PROFILE_COMPLETED_ENDPOINT,
//     ANALYTICS: USER_ANALYTICS_ENDPOINT,
//     ROSTER: USER_ROSTER_ENDPOINT,
//     PAYMENTS: USER_PAYMENTS_ENDPOINT
//   }


//   const {
//     data,
//     error,
//     isLoading,
//     refetch,
//   } = useQuery<
//     IGETUserResponse,
//     unknown,
//     IGETUserResponse,
//     [string, IGETUserDataQuery]
//   >(
//     ["UserData", GETUserDataParams],
//     async () => {
//       const response = await api.get<IGETUserResponse>(endPoint[query], {
//         params: GETUserDataParams,
//       });

//       return response.data
//     },
//     {
//       refetchOnWindowFocus: false,
//       ...UseQueryOptions,
//     }
//   );

//   return {
//     user: data as IUser,
//     userCompletedProfile: data as IGETUserCompletedProfileResponse,
//     userPerformance: data as IGETUserPerformanceResponse,
//     userReviews: data as IGETUserReviewsResponse,
//     userRequests: data as IGETUserRequestsResponse,
//     userPaymentsAnalytics: data as IGETUserPaymentAnalyticsResponse,
//     userRosterAnalytics: data as IGETUserRosterAnalyticsResponse,
//     userRoster: data as IGETCompanyRosterResponse,
//     userTasks: data as IGETCompanyRosterResponse,
//     userPayments: data as IPayments[],

//     userDataError: error ? true : false,
//     isUserDataLoading: isLoading,
//     refetchUserData: refetch,
//     GETUserDataParams,
//     setGETUserDataParams,
//   };
// }


// export function usePOSTUserDataHooks(
//   query: IPOSTUserDataQueryType,
//   AxiosRequestConfig?: AxiosRequestConfig,
//   UseMutationOptions?: UseMutationOptions<IUser, unknown, IPOSTUserBody>
// ) {

//   const endPoint = {
//     REQUEST: USER_REQUEST_ENDPOINT,
//     DOCUMENT: USER_DOCUMENTS_ENDPOINT,
//     HACCP: USER_HACCP_ENDPOINT
//   }

//   const { mutate, isLoading } = useMutation(
//     async ({ data }: IPOSTUserBody) => {
//       const response = await api.post<IUser>(`${endPoint[query]}`, {
//         data,
//         ...AxiosRequestConfig,
//       });
//       return response.data;
//     },
//     {
//       ...UseMutationOptions,
//     }
//   );

//   return {
//     createUserData: mutate,
//     isCreateUserDataLoading: isLoading,
//   };
// }


// export function usePUTUserDataHooks(
//   query: IPUTUserDataQueryType,
//   AxiosRequestConfig?: AxiosRequestConfig,
//   UseMutationOptions?: UseMutationOptions<IUser, unknown, IPUTUserBody>
// ) {

//   const endPoint = {
//     DETAILS: USER_ENDPOINT,
//     ROSTER: USER_ROSTER_ENDPOINT,
//     CONTRACT: USER_CONTRACT_ENDPOINT
//   }

//   const { mutate, isLoading } = useMutation(
//     async ({ data }: IPUTUserBody) => {
//       const response = await api.put<IUser>(`${endPoint[query]}`, {
//         data,
//         ...AxiosRequestConfig,
//       });
//       return response.data;
//     },
//     {
//       ...UseMutationOptions,
//     }
//   );

//   return {
//     updateUserData: mutate,
//     isUpdateUserDataLoading: isLoading,
//   };
// }



// export function useDELETEUserDataHooks(
//   query: IDELETEUserDataQueryType,
//   AxiosRequestConfig?: AxiosRequestConfig,
//   UseMutationOptions?: UseMutationOptions<void, unknown, IDELETEUserBody>
// ) {

//   const endPoint = {
//     DETAILS: USER_ENDPOINT,
//     REQUESTS: USER_REQUEST_ENDPOINT,
//     DOCUMENT: USER_DOCUMENTS_ENDPOINT
//   }

//   const { mutate, isLoading } = useMutation(
//     async (data: IDELETEUserBody) => {
//       const response = await api.delete<void>(
//         endPoint[query],
//         {
//           data,
//           ...AxiosRequestConfig,
//         }
//       );
//       return response.data;
//     },
//     {
//       ...UseMutationOptions,
//     }
//   );

//   return {
//     deleteUserData: mutate,
//     isDeleteUserDataLoading: isLoading,
//   };
// }

