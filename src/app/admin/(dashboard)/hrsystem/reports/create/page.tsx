'use client'
//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import CreateReportsForm from "./_components/createReportsForm";


export default function Create() {
    const {
        companyAllForms: companyForms,
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




    return (
        <CreateReportsForm
            formSections={companyFormSections?.data}
            forms={companyForms?.data}
        />
    )
}