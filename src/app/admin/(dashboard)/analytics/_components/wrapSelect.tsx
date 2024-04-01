'use client'
import Icon from "@/common/libs/lucida-icon";
import { cn } from "@/common/libs/shadcn/utils";
import { Button } from "@/components/ui/button";

interface WrapSelectProps {
    children: React.ReactNode
    selected: boolean
    handleSelect: () => void
    donwload?: {
        onClick: () => void
    }
}

export default function WrapSelect({ children, selected, handleSelect, donwload }: WrapSelectProps): JSX.Element {
    return (
        <div
            className={cn('border-2 rounded-2xl cursor-pointer w-full relative', selected ? 'border-primary' : 'border-transparent')}
            onClick={handleSelect}
        >
            {donwload &&
                <Button
                    className='absolute left-2 top-2'
                    size='iconExSm'
                    variant='orange'
                    onClick={donwload.onClick}
                >
                    <Icon
                        name='FileDown'
                    />
                </Button>
            }
            {children}
        </div>
    )
}