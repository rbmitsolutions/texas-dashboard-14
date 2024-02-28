import Icon from "@/common/libs/lucida-icon"
import { cn } from "@/common/libs/shadcn/utils"
import { icons } from "lucide-react"

interface ConTextProps {
    icon: keyof typeof icons
    text: string | number
    iconSize?: number
    pclass?: string
    className?: string
}
export default function IconText({ icon, text, iconSize = 18, pclass, className }: ConTextProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Icon name={icon} size={iconSize}/>
            <p className={cn('text-sm capitalize', pclass)}>{String(text)?.toLowerCase()}</p>
        </div>
    )
}