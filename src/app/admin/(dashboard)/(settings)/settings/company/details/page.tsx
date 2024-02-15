'use client'
import { useGETCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import CompanyDetailsForm from "@/components/common/forms/company/companyDetails";

export default function CompanyDetailsSettings() {
    const {
        companyDetails,
        isCompanyDataLoading: isLoading,
        refetchCompanyData: toRefetch
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

    const {
        updateCompanyData: onUpdate
    } = usePUTCompanyDataHooks({
        query: 'DETAILS',
        toRefetch
    })

    if(isLoading) return <div>Loading...</div>

    return (
        <CompanyDetailsForm 
            details={companyDetails?.details || {}}
            onUpdate={onUpdate}
        />
    )
}