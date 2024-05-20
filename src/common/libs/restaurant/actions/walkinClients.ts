import { parseCookies, setCookie } from "nookies";
import { api } from "@/common/libs/axios/api";

//interfaces
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";
import { IClientSchema } from "../../zod/forms/restaurant/clientsForm";

export const getWalkInClient = async (): Promise<IClientSchema> => {
    const tokenKey: string = process.env.NEXT_PUBLIC_WALKIN_COOKIE_KEY! as string;
    const cookie = await parseCookies()

    let token: IClientSchema | undefined

    if (cookie[tokenKey]) {
        token = JSON.parse(cookie[tokenKey])
    }

    if (token) {
        return token
    }

    try {
        const { data: walkInClient } = await api.get<IClientSchema>(
            EndPointsTypes.RESTAURANT_CLIENT_ENDPOINT, {
            params: {
                clients: {
                    byEmail: {
                        email: 'walkin@walkin.com'
                    }
                }
            }
        })
        setCookie(null, process.env.NEXT_PUBLIC_WALKIN_COOKIE_KEY as string, JSON.stringify(walkInClient), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
        return walkInClient
    } catch (err) {
        throw err
    }
}