'use server'
import { IToken } from "@/common/types/auth/auth.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { cookies } from "next/headers"
import { api } from "../../axios/api"
import { IGETRequestsQuery, IRequestsGetAllResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { IRequests } from "@/common/types/company/requests.interface"

export const getRequests = async (params: IGETRequestsQuery): Promise<IRequestsGetAllResponse | IRequests> => {
    const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
    const cookieStore: IToken = JSON.parse(cookie?.value!)

    const paramsUrl = new URLSearchParams({
        requests: JSON.stringify(params)
    })

    const data = await api.get(`${EndPointsTypes['COMPANY_REQUESTS_ENDPOINT']}?${paramsUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${cookieStore?.token}`
        },
    }).then(data => {
        return data
    }).catch(err => {
        return err
    })

    if (params?.all) {
        return data?.data as IRequestsGetAllResponse
    } else {
        return data?.data as IRequests
    }
}
