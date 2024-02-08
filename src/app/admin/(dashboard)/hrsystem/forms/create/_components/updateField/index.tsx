import { useEffect, useState } from "react"     

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import InputUpdate from "./inputUpdate"
import SelectUpdate from "./selectUpdate"
import RadioGroupUpdate from "./radioGroupUpdate"
import TextareaUpdate from "./textareaUpdate"

//interface
import { IFormBuildInput } from "@/common/utils/formBuilder"

interface UpdateFieldProps {
    field: IFormBuildInput
    setField: React.Dispatch<React.SetStateAction<IFormBuildInput>>
    replaceField: (field: IFormBuildInput) => void
}

export default function UpdateField({ field, setField, replaceField }: UpdateFieldProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const onToggleDialog = () => {
        setIsDialogOpen(!isDialogOpen)
        setField({} as IFormBuildInput)
    }

    const renderFieldUpdate = () => {
        switch (field?.type) {
            case 'input':
                return <InputUpdate field={field} onSave={onSave} />
            case 'radio_group':
                return <RadioGroupUpdate field={field} onSave={onSave} />
            case 'select':
                return <SelectUpdate field={field} onSave={onSave} />
            case 'textarea':
                return <TextareaUpdate field={field} onSave={onSave} />
            default:
                return <div />
        }
    }

    const onSave = (field: IFormBuildInput) => {
        replaceField(field)
    }

    useEffect(() => {
        if (field?.type) {
            setIsDialogOpen(true)
        }
    }, [field])

    return (
        <Dialog open={isDialogOpen} onOpenChange={onToggleDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Field</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {renderFieldUpdate()}
                </div>
            </DialogContent>
        </Dialog>
    )
}