'use server'
import { IToken } from "@/common/types/auth/auth.interface"
import { IGETCompanyAllFilesResponse, IGETFilesQuery } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { cookies } from "next/headers"
import { api } from "../../axios/api"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { IFiles } from "@/common/types/company/files.interface"

export const getFilesAsUser = async (params: IGETFilesQuery): Promise<IFiles | IGETCompanyAllFilesResponse> => {
    const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
    const cookieStore: IToken = JSON.parse(cookie?.value!)

    let paramsWithKey: IGETFilesQuery = {}

    if (params?.all) {
        paramsWithKey = {
            all: {
                ...params?.all,
                key: cookieStore?.user_id
            }
        }
    }

    if (params?.byId) {
        paramsWithKey = {
            byId: {
                ...params?.byId,
                key: cookieStore?.user_id
            }
        }
    }

    if (params?.byKeyAs) {
        paramsWithKey = {
            byKeyAs: {
                ...params?.byKeyAs,
                key: cookieStore?.user_id
            }
        }
    }

    const paramsUrl = new URLSearchParams({
        files: JSON.stringify(paramsWithKey)
    })

    const data = await api.get(`${EndPointsTypes['USER_FILES_ENDPOINT']}?${paramsUrl}`, {
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
        return data?.data as IGETCompanyAllFilesResponse
    } else {
        return data?.data as IFiles
    }
}
