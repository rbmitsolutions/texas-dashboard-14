'use client'
import { useRouter } from "next/navigation"


//components
import FormLayout from "@/components/common/forms/formLayout"

//hooks
import { usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interfaces
import { IRosterTasks } from "@/common/types/company/roster.interface"
import { IFormBuildInput } from "@/common/utils/formBuilder"
import { IForm } from "@/common/types/company/form.interface"

interface FormContainerProps {
    form: IForm
    rosterTask: IRosterTasks
}

export default function FormContainer({ form, rosterTask }: FormContainerProps): JSX.Element {
    const router = useRouter()
    const { user } = useAuthHooks()

    const {
        createCompanyData: createCompanyDataForm
    } = usePOSTCompanyDataHooks({
        query: 'FORM_DATA'
    })
    const onSubmit = async (data: IFormBuildInput[][]) => {
        await createCompanyDataForm({
            formData: {
                by: user?.name,
                title: form?.title,
                values: data as any,
                rosterTask: {
                    done: true,
                    id: rosterTask?.id
                }
            }
        }, {
            onSuccess: () => {
                router.back()
            }
        })
    }
    return (
        <FormLayout form={form} onSubmit={onSubmit} />
    )

}