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
            className={cn('flex items-center justify-center bg-primary shadow rounded-md h-7 w-7 bg-blue-400 hover:bg-blue-600/80 dark:bg-blue-400 dark:text-black dark:hover:bg-blue-400/80', className)}
            href={href}>
            <Icon name={icon} size={16} />
        </Link>
    )
}