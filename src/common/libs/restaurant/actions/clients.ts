'use server'
import { IToken } from "@/common/types/auth/auth.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { cookies } from "next/headers"
import { api } from "../../axios/api"
import { IGETClientQuery, IGetAllClientsResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IClientSchema } from "../../zod/forms/restaurant/clientsForm"

export const getClients = async (params: IGETClientQuery): Promise<IGetAllClientsResponse | IClientSchema> => {
    const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
    const cookieStore: IToken = JSON.parse(cookie?.value!)

    const paramsUrl = new URLSearchParams({
        clients: JSON.stringify(params)
    })

    const data = await api.get(`${EndPointsTypes['RESTAURANT_CLIENT_ENDPOINT']}?${paramsUrl}`, {
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
        return data?.data as IGetAllClientsResponse
    } else {
        return data?.data as IClientSchema
    }
}
