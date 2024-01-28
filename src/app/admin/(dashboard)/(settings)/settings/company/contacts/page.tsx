'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import CompanyContactsForm from "@/components/common/forms/company/companyContacts";

export default function CompanyContactsSettings() {
    const {
        companyDetails,
        isCompanyDataFetching
    } = useGETCompanyDataHooks({
        query: 'DETAILS',
        defaultParams: {
            details: {
                all: {
                    contacts: '1',
                }
            }
        }
    })

    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <CompanyContactsForm
            contacts={companyDetails?.contacts}
        />
    )
}