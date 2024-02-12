import Icon from "@/common/libs/lucida-icon"
import { cn } from "@/common/libs/shadcn/utils"
import { icons } from "lucide-react"

interface ConTextProps {
    icon: keyof typeof icons
    text: string | number
    className?: string
}
export default function IconText({ icon, text, className }: ConTextProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Icon name={icon} size={18}/>
            <p className='text-sm'>{text}</p>
        </div>
    )
}