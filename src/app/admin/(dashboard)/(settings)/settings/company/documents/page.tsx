'use client'
//components
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import CreateDocumentForm from "./_components/createDocument";
import CompanyDocumentsForm from "@/components/common/forms/company/companyDocuments";

export default function CompanyDocumentsSettings() {
    const {
        companyDetails,
        isCompanyDataFetching,
        refetchCompanyData: toRefetch
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

    const {
        createCompanyData: createDocument,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'DOCUMENTS',
        toRefetch
    })

    const {
        deleteCompanyData: deleteDocument,
    } = useDELETECompanyDataHooks({
        query: 'DOCUMENTS',
        toRefetch

    })

    if (isCompanyDataFetching) return <div>Loading...</div>

    return (
        <Wrap
            actions={{
                toRight: <CreateDocumentForm
                    createDocument={createDocument}
                    isLoading={isLoading}
                />,
                className: 'flex justify-end'
            }}
        >
            <CompanyDocumentsForm
                documents={companyDetails?.documents}
                deleteDocument={deleteDocument}
            />
        </Wrap>
    )
}