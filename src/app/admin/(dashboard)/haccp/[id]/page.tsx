import { getForms } from "@/common/libs/company/actions/forms";
import { IForm } from "@/common/types/company/form.interface";
import FormRender from "./_components.tsx/formRender";

export default async function FormPage(params: { params: { id: string } }) {
    const form = await getForms({
         byId: {
            id: params?.params?.id,
         }
    }) as IForm


    return (
        <FormRender form={form} />
    )
}