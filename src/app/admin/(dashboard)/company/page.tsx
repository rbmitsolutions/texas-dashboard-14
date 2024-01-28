'use client'
// 'use server'
import CompanyContactsForm from "@/components/common/forms/company/companyContacts"
import CompanyDetailsForm from "@/components/common/forms/company/companyDetails"
import CompanyDocumentsForm from "@/components/common/forms/company/companyDocuments"
import CompanyLinkForm from "@/components/common/forms/company/companyLinks"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

import { IToken } from '@/common/types/auth/auth.interface'
import { cookies } from "next/headers"
import { ICompanyDetailsResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"

// const getData = async (params: any) => {
//     const cookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string)
//     if (!cookie) return
//     const cookieStore: IToken = JSON.parse(cookie?.value)
//     const paramsUrl = new URLSearchParams({
//         details: JSON.stringify(params.details)
//     })
//     const res = await fetch(`http://localhost:3333/company/details?${paramsUrl}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${cookieStore?.token}`
//         },

//     })
//     const data = await res.json()
//     return data
// }

export default function Company() {
    // const data: ICompanyDetailsResponse = await getData({
    //     details: {
    //         all: {
    //             contacts: '1',
    //             details: '1',
    //             documents: '1',
    //             links: '1'
    //         }
    //     }
    // })

    const {
        companyDetails,
        isCompanyDataFetching
    } = useGETCompanyDataHooks({
        query: 'DETAILS',
        defaultParams: {
            details: {
                all: {
                    contacts: '1',
                    details: '1',
                    documents: '1',
                    links: '1'
                }
            }
        }
    })

    if (isCompanyDataFetching) return null

    return (
        <div className='flex-col-container gap-4'>
            <CompanyDetailsForm details={companyDetails?.details} />
            <CompanyContactsForm contacts={companyDetails?.contacts} />
            <CompanyLinkForm links={companyDetails?.links} />
            <CompanyDocumentsForm documents={companyDetails?.documents} />
        </div>
    )
}