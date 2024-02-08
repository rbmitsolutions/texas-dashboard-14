import { cn } from "@/common/libs/shadcn/utils"
import { IRequestsStatus } from "@/common/types/company/requests.interface"
import { Badge } from "@/components/ui/badge"

interface InfoBadgeProps {
    status: IRequestsStatus | 'done' | 'pending'
}

export default function InfoBadge({ status }: InfoBadgeProps) {

    const statusColor = (status: InfoBadgeProps['status']) => {
        switch (status.toLocaleLowerCase().replace(" ", "")) {
            case 'working':
            case 'pending':
            case 'waiting':
                return 'bg-orange-600 dark:bg-orange-300 hover:bg-orange-700 dark:hover:bg-orange-400'
            case 'approved':
            case 'done':
                return 'bg-green-600 dark:bg-green-300 hover:bg-green-700 dark:hover:bg-green-400'
            case 'denied':
                return 'bg-red-600 dark:bg-red-300 hover:bg-red-700 dark:hover:bg-red-400'
            default:
                return 'bg-orange-800'
        }
    }

    return (
        <Badge className={cn('capitalize', statusColor(status))}>
            {status?.toLowerCase()}
        </Badge>
    )
}