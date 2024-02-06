import { UseFormReturn } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'

//components
import { Button } from "@/components/ui/button";

//libs
import { CreateFormFormSchemaType } from "@/common/libs/zod/forms/company/companyCreateForm";
import Icon from "@/common/libs/lucida-icon";

//inteface
import { IFormBuildInput, fieldBuilder } from "@/common/utils/formBuilder";

interface SortbleFieldProps {
    form: UseFormReturn<CreateFormFormSchemaType, any, undefined>,
    input: IFormBuildInput
    deleteField: (field: any) => void
    setField: React.Dispatch<React.SetStateAction<any>>
}

export default function SortbleField({ form, input, deleteField, setField }: SortbleFieldProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: input?.register })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className='relative bg-foreground/5 p-2 group rounded-md border-[1px] hover:border-primary hover:bg-foreground/10' >
            <div className='hidden gap-2 absolute top-2 right-2 group-hover:flex'>
                <Button {...attributes} {...listeners}  type='button' size='iconExSm'>
                    <Icon name={isDragging ? 'Grab' : 'Hand'} />
                </Button>
                <Button
                    size='iconExSm'
                    variant='orange'
                    type='button'
                    onClick={() => setField(input)}
                >
                    <Icon name='Pen' />
                </Button>
                <Button
                    size='iconExSm'
                    variant='destructive'
                    type='button'
                    onClick={() => deleteField(input)}
                >
                    <Icon name='Trash' />
                </Button>
            </div>
            {fieldBuilder(input, form as any)}
        </div>
    )
}