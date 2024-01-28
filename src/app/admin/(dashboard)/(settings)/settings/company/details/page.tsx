'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import CompanyDetailsForm from "@/components/common/forms/company/companyDetails";

export default function CompanyDetailsSettings() {
    const {
        companyDetails,
        isCompanyDataFetching
    } = useGETCompanyDataHooks({
        query: 'DETAILS',
        defaultParams: {
            details: {
                all: {
                    details: '1',
                }
            }
        }
    })

    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <CompanyDetailsForm 
            details={companyDetails?.details}
        />
    )
}