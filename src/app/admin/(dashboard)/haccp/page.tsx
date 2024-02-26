'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import HaccpContainer from "./_components/haccpContainer"

export default function Haccp() {
    const {
        companyAllForms: forms
    } = useGETCompanyDataHooks({
        query: 'FORMS',
        defaultParams: {
            forms: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                    orderBy:{
                         key: 'title',
                        order: 'asc'
                    }
                }
            }
        }
    })

    const {
        companyAllFormSection: formsSections
    } = useGETCompanyDataHooks({
        query: 'FORM_SECTION',
        defaultParams: {
            formSections: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                    include: {
                        form: '1'
                    },
                }
            }
        }
    })

    return (
        <div>
            <HaccpContainer forms={forms?.data || []} formsSections={formsSections?.data || []} />
        </div>
    )
}