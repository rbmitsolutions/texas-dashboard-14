'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

export default function EditForm (params: { params: { id: string } }) { 
    const {
        companyForm: form,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'FORMS',
        defaultParams: {
            forms: {
                byId: {
                    id: params?.params?.id,
                    include: {
                        section: '1'
                    }
                }
            }
        }
    })

    return (
        <div>
            {form?.title}
        </div>
    )
}