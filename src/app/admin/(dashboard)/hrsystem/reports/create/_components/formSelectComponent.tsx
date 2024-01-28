import { UseFormReturn } from "react-hook-form"
import { ReportsFormSchemaType } from "@/common/libs/zod/forms/company/companyReports"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

//interface
import { IForm } from "@/common/types/company/form.interface"

interface ICreateReports {
    form_id: string,
    form_title: string,
    description: string
}

interface FormSelectComponentProps {
    form: IForm
    append: (data: ICreateReports) => void
    remove: (index: number) => void
    fields: ICreateReports[]
    formState: UseFormReturn<ReportsFormSchemaType>
}

export function FormSelectComponent({ form, append, remove, fields, formState }: FormSelectComponentProps) {
    return (
        <label key={form?.id} id={form?.id} className='cursor-pointer'>
            <div className='flex-container-center'>
                <Checkbox
                    onCheckedChange={(e) => e ? append({
                        form_id: form?.id,
                        description: '',
                        form_title: form?.title
                    }) : remove(fields.findIndex(r => r.form_id === form?.id))

                    }
                />
                <span className='ml-2 text-sm'>{form?.title}</span>
            </div>
            {fields?.find(r => r.form_id === form?.id) &&
                <Textarea
                    className='mt-4 min-h-32'
                    placeholder={form?.title + ' - Any Comments'}
                    {...formState.register(`reports.${fields?.findIndex(r => r.form_id === form?.id)}.description`)}
                />
            }
        </label>
    )
}