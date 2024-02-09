'use server'
import { IToken } from "@/common/types/auth/auth.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { IGETTransactionsQuery, IGetAllTransactionsResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { cookies } from "next/headers"
import { api } from "../../axios/api"
import { ITransactions } from "@/common/types/company/transactions.interface"

export const getTransactions = async (params: IGETTransactionsQuery): Promise<IGetAllTransactionsResponse | ITransactions> => {
    const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
    const cookieStore: IToken = JSON.parse(cookie?.value!)

    const paramsUrl = new URLSearchParams({
        transactions: JSON.stringify(params)
    })

    const data = await api.get(`${EndPointsTypes['COMPANY_TRANSACTIONS_ENDPOINT']}?${paramsUrl}`, {
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
        return data?.data as IGetAllTransactionsResponse
    } else {
        return data?.data as ITransactions
    }
}
