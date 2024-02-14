'use client'
// 'use server'
import CompanyContactsForm from "@/components/common/forms/company/companyContacts"
import CompanyDetailsForm from "@/components/common/forms/company/companyDetails"
import CompanyDocumentsForm from "@/components/common/forms/company/companyDocuments"
import CompanyLinkForm from "@/components/common/forms/company/companyLinks"
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"


export default function Company() {
    const {
        companyDetails,
        isUserDataFetching
    } = useGETUserDataHooks({
        query: 'COMPANY_DETAILS',
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

    if (isUserDataFetching) return null

    return (
        <div className='flex-col-container gap-4'>
            <CompanyDetailsForm details={companyDetails?.details} />
            <CompanyContactsForm contacts={companyDetails?.contacts} />
            <CompanyLinkForm links={companyDetails?.links} />
            <CompanyDocumentsForm documents={companyDetails?.documents} />
        </div>
    )
}