'use server'
import { IToken } from "@/common/types/auth/auth.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { cookies } from "next/headers"
import { api } from "../../axios/api"
import { IFormSectionGetAllResponse, IGETFormSectionQuery } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { IFormSection } from "@/common/types/company/form.interface"

export const getFormSections = async (params: IGETFormSectionQuery):Promise<IFormSectionGetAllResponse | IFormSection> => {
    const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
    const cookieStore: IToken = JSON.parse(cookie?.value!)
    
    const paramsUrl = new URLSearchParams({
        formSections: JSON.stringify(params)
    })

    const data = await api.get(`${EndPointsTypes['COMPANY_FORM_SECTIONS_ENDPOINT']}?${paramsUrl}`, {
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

    if(params?.all){
        return data?.data as IFormSectionGetAllResponse
    } else {
        return data?.data as IFormSection
    }
}
