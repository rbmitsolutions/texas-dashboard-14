'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import CompanyLinkForm from "@/components/common/forms/company/companyLinks";

export default function CompanyLinksSettings() {
    const {
        companyDetails,
        isCompanyDataFetching
    } = useGETCompanyDataHooks({
        query: 'DETAILS',
        defaultParams: {
            details: {
                all: {
                    links: '1'
                }
            }
        }
    })

    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <CompanyLinkForm
        links={companyDetails?.links}
        />
    )
}