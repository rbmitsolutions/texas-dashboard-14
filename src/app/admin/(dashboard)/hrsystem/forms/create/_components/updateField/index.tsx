import { IFormBuildInput } from "@/common/utils/formBuilder"
import { useState } from "react"
import InputUpdate from "./inputUpdate"
import SelectUpdate from "./selectUpdate"
import RadioGroupUpdate from "./radioGroupUpdate"
import TextareaUpdate from "./textareaUpdate"

interface UpdateFieldProps {
    field: IFormBuildInput
    replaceField: (field: IFormBuildInput) => void
}

export default function UpdateField({ field, replaceField }: UpdateFieldProps) {


    const renderFieldUpdate = () => {
        switch (field?.type) {
            case 'input':
                return <InputUpdate field={field} onSave={onSave}/>
            case 'radio_group':
                return <RadioGroupUpdate field={field} onSave={onSave}/>
            case 'select':
                return <SelectUpdate field={field} onSave={onSave}/>
            case 'textarea':
                return <TextareaUpdate field={field} onSave={onSave}/>
            default:
                return <div />
        }
    }

    const onSave = (field: IFormBuildInput) => {
        replaceField(field)
    }

    return (
        <div className='flex-col-container p-2 border-2 rounded-xl'>
            <h2>Update</h2>
            {renderFieldUpdate()}
        </div>
    )
}