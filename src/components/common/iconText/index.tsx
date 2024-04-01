import Icon from "@/common/libs/lucida-icon"
import { cn } from "@/common/libs/shadcn/utils"
import { icons } from "lucide-react"
import Loading from "../loadingError/_components/loading"

interface ConTextProps {
    icon: keyof typeof icons
    text: string | number
    iconSize?: number
    pclass?: string
    className?: string
    isLoading?: boolean
}
export default function IconText({ icon, text, iconSize = 18, pclass, className, isLoading = false }: ConTextProps) {

    if (isLoading) {
        return (
            <div className={cn('flex items-center gap-2 h-8', className)}>
                <Loading className='h-6 w-6' />
                <p className={cn('text-sm capitalize', pclass)}>...</p>
            </div>
        )
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Icon name={icon} size={iconSize} />
            <p className={cn('text-sm capitalize', pclass)}>{String(text)?.toLowerCase()}</p>
        </div>
    )
}