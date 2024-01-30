import Icon from "@/common/libs/lucida-icon"
import { cn } from "@/common/libs/shadcn/utils"
import { icons } from "lucide-react"
import Link from "next/link"
interface LinkButtonProps {
    href: string
    icon?: keyof typeof icons
    className?: string
}
export default function LinkButton({ href, icon = 'ChevronRight', className }: LinkButtonProps) {
    return (
        <Link
            className={cn('flex items-center justify-center bg-primary text-primary-foreground shadow hover:bg-primary/80 rounded-md h-7 w-7', className)}
            href={href}>
            <Icon name={icon} size={16} />
        </Link>
    )
}