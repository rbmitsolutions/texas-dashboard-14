'use client'
import { useState } from "react";

//components
import FormLayout from "@/components/common/forms/formLayout";
import AuthDialog from "@/components/common/authDialog";

//hooks
import { usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IToken, Permissions } from "@/common/types/auth/auth.interface";
import { IForm } from "@/common/types/company/form.interface";
import { IFormBuildInput } from "@/common/utils/formBuilder";
import toast from "react-hot-toast";

interface FormRenderProps {
    form: IForm
}
export default function FormRender({ form }: FormRenderProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<IFormBuildInput[][]>([[]])
    const [toResetSign, setToResetSign] = useState<boolean>(false)

    const {
        createCompanyData: createCompanyDataForm
    } = usePOSTCompanyDataHooks({
        query: 'FORM_DATA'
    })

    const toggleAuthDialog = () => {
        setIsOpen(!isOpen)
    }

    const resetForm = () => {
        setData([[]])
        setToResetSign(!toResetSign)
    };


    const handleAuthDialogResponse = async (token: IToken) => {
        if (token) {
            await onSubmit(token, data);
        }
    }

    const openAuthDialog = (data: IFormBuildInput[][]) => {
        toggleAuthDialog()
        setData(data)
    }

    const onSubmit = async (token: IToken, data: IFormBuildInput[][]) => {
        await createCompanyDataForm({
            formData: {
                by: token?.name,
                title: form?.title,
                values: data as any,
            }
        }, {
            onSuccess: () => {
                toast.success('Form submitted successfully')
                //call the resetForm function inside the formLayout component
                resetForm();
            },
            onError: () => {
                toast.error('Form submission failed')
            }
        })
    }

    return (
        <>
            <AuthDialog
                isOpen={isOpen}
                toggleAuthDialog={toggleAuthDialog}
                handleAuthResponse={handleAuthDialogResponse}
                permissions={[Permissions.MY_PROFILE]}
                save={false}
            />
            <FormLayout
                form={form}
                onSubmit={openAuthDialog}
                toReset={toResetSign}
            />
        </>
    )
}