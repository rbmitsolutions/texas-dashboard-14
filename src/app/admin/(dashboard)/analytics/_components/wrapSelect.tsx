'use client'
import { cn } from "@/common/libs/shadcn/utils";

interface WrapSelectProps {
    children: React.ReactNode
    selected: boolean
    handleSelect: () => void
}

export default function WrapSelect({ children, selected, handleSelect }: WrapSelectProps): JSX.Element {
    return (
        <div
            className={cn('border-2 rounded-2xl cursor-pointer w-full relative', selected ? 'border-primary' : 'border-transparent')}
            onClick={handleSelect}
        >
           
            {children}
        </div>
    )
}