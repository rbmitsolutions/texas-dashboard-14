'use client'
//components
import CompanyLinkForm from "@/components/common/forms/company/companyLinks";
import CreateLinkForm from "./_components/createLink";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

export default function CompanyLinksSettings() {
    const {
        companyDetails,
        isCompanyDataFetching,
        refetchCompanyData: toRefetch
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

    const {
        createCompanyData: createLink,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'LINKS',
        toRefetch
    })

    const {
        deleteCompanyData: deleteLink,
    } = useDELETECompanyDataHooks({
        query: 'LINKS',
        toRefetch

    })

    const linksSection = ['Training', 'Onboarding', 'Requests & Notifications']
    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <Wrap
            actions={{
                toRight: <CreateLinkForm
                    createLink={createLink}
                    isLoading={isLoading}
                    sections={linksSection}
                />,
                className: 'flex justify-end'
            }}
        >
            <CompanyLinkForm
                links={companyDetails?.links}
                deleteLink={deleteLink}
            />
        </Wrap>
    )
}