import Icon from "@/common/libs/lucida-icon";
import { IFormBuildInput } from "@/common/utils/formBuilder";
import { Button } from "@/components/ui/button";

interface AddFieldProps {
    children: React.ReactNode
    addField: (field: IFormBuildInput) => void
    field: IFormBuildInput
}

export default function AddField({ addField, field, children }: AddFieldProps): JSX.Element {
    return (
        <div className='grid grid-cols-[1fr,auto] items-center gap-2 p-2 border-2 rounded-lg hover:bg-foreground/5'>
            {children}
            <Button size='iconSm' onClick={() => addField(field)}>
                <Icon name='Plus' />
            </Button>
        </div>
    )
}