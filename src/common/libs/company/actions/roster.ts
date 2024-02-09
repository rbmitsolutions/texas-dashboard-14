'use server'
import { IToken } from "@/common/types/auth/auth.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { IGETCompanyRosterQuery,  IRosterPageResponse, IRosterPaymentPageResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { cookies } from "next/headers"
import { api } from "../../axios/api"

export const getRoster = async (params: IGETCompanyRosterQuery): Promise<IRosterPageResponse | IRosterPaymentPageResponse> => {
    const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
    const cookieStore: IToken = JSON.parse(cookie?.value!)

    const paramsUrl = new URLSearchParams({
        roster: JSON.stringify(params)
    })

    const data = await api.get(`${EndPointsTypes['COMPANY_ROSTER_ENDPOINT']}?${paramsUrl}`, {
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

    if(params?.rosterPage) {
        return data?.data as IRosterPageResponse
    } else {
        return data?.data as IRosterPaymentPageResponse
    }
}
