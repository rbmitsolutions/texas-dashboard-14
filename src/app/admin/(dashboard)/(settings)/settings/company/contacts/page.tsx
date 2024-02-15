'use client'

//components
import CompanyContactsForm from "@/components/common/forms/company/companyContacts";
import CreateContactForm from "./_components/createContactForm";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

export default function CompanyContactsSettings() {
    const {
        companyDetails,
        isCompanyDataFetching,
        refetchCompanyData: toRefetch
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

    const {
        createCompanyData: createContact,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'CONTACTS',
        toRefetch
    })

    const {
        deleteCompanyData: deleteContact,
    } = useDELETECompanyDataHooks({
        query: 'CONTACTS',
        toRefetch

    })

    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <Wrap
            actions={{
                toRight: <CreateContactForm
                    createContact={createContact}
                    isLoading={isLoading}
                />,
                className: 'flex justify-end'
            }}
        >
            <CompanyContactsForm
                contacts={companyDetails?.contacts}
                onDelete={deleteContact}
            />
        </Wrap>
    )
}