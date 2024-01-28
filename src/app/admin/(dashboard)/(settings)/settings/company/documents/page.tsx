'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import CompanyDocumentsForm from "@/components/common/forms/company/companyDocuments";

export default function CompanyDocumentsSettings() {
    const {
        companyDetails,
        isCompanyDataFetching
    } = useGETCompanyDataHooks({
        query: 'DETAILS',
        defaultParams: {
            details: {
                all: {
                    documents: '1'
                }
            }
        }
    })

    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <CompanyDocumentsForm
            documents={companyDetails?.documents}
        />
    )
}