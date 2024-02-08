'use server'
import { getFormSections } from "@/common/libs/company/actions/formsSections"
import { getForms } from "@/common/libs/company/actions/forms"
import HaccpContainer from "./_components/haccpContainer"

//interface
import { IFormSectionGetAllResponse, IFormsGetAllResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"

export default async function Haccp() {
    const forms = await getForms({
        all: {
            pagination: {
                take: 500,
                skip: 0
            }
        }
    }) as IFormsGetAllResponse
    
    const formsSections = await getFormSections({
        all: {
            pagination: {
                take: 500,
                skip: 0
            },
            include: {
                form: '1'
            }
        }
    }) as IFormSectionGetAllResponse

    return (
        <div>
            <HaccpContainer forms={forms?.data} formsSections={formsSections?.data} />
        </div>
    )
}