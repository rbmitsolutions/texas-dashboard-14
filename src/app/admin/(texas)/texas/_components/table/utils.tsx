import { parseCookies, setCookie } from "nookies";
import { api } from "@/common/libs/axios/api";

//interfaces
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";
import { IClient } from "@/common/types/restaurant/client.interface";

export const getWalkInClient = async (): Promise<IClient> => {
    const tokenKey: string = process.env.NEXT_PUBLIC_WALKIN_COOKIE_KEY! as string;
    const cookie = await parseCookies()

    let token: IClient | undefined

    if (cookie[tokenKey]) {
        token = JSON.parse(cookie[tokenKey])
    }

    if (token) {
        return token
    }

    try {
        const { data: walkInClient } = await api.get<IClient>(
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