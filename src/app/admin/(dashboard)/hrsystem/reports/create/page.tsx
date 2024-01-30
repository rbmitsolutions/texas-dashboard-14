'use client'
//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import CreateReportsForm from "./_components/createReportsForm";
import Wrap from "@/components/common/wrap";


export default function Create() {
    const {
        companyAllForms: companyForms,
        isCompanyDataLoading: isFormsLoading,
        companyDataError: formsError,
    } = useGETCompanyDataHooks({
        query: 'FORMS',
        defaultParams: {
            forms: {
                all: {
                    include: {
                        section: '1'
                    },
                    pagination: {
                        skip: 0,
                        take: 20
                    }
                }
            }
        },
    })

    const {
        companyAllFormSection: companyFormSections,
    } = useGETCompanyDataHooks({
        query: 'FORM_SECTION',
        defaultParams: {
            formSections: {
                all: {
                    include: {
                        form: '1'
                    },
                    pagination: {
                        take: 50,
                        skip: 0
                    }
                }
            }
        }
    })


    const { createCompanyData: createReport, isCreateCompanyDataLoading: isCreateReportLoading } = usePOSTCompanyDataHooks({
        query: 'HACCP_REPORTS',
    })

    return (
        <Wrap
            isLoading={isFormsLoading}
            error={formsError}
        >
            <CreateReportsForm
                formSections={companyFormSections?.data}
                forms={companyForms?.data}
                create={{
                    createReport,
                    isCreateReportLoading
                }}
            />
        </Wrap>
    )
}