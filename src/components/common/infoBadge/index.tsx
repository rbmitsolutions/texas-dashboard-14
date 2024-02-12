import { cn } from "@/common/libs/shadcn/utils"
import { IRequestsStatus } from "@/common/types/company/requests.interface"
import { IBookingStatus, IReviewsType } from "@/common/types/restaurant/bookings.interface"
import { Badge } from "@/components/ui/badge"

interface InfoBadgeProps {
    status: IBookingStatus | IReviewsType | IRequestsStatus | 'done' | 'pending'
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
            case 'confirmed':
            case 'restaurant':
                return 'bg-green-600 dark:bg-green-300 hover:bg-green-700 dark:hover:bg-green-400'
            case 'denied':
            case 'unconfirmed':
                return 'bg-red-600 dark:bg-red-300 hover:bg-red-700 dark:hover:bg-red-400'
            case 'canceled':
                return 'bg-yellow-600 dark:bg-yellow-300 hover:bg-yellow-700 dark:hover:bg-yellow-400'
            case 'arrived':
            case 'staff':
                return 'bg-purple-600 dark:bg-purple-300 hover:bg-purple-700 dark:hover:bg-purple-400'
            case 'not_shown':
                return 'bg-blue-600 dark:bg-blue-300 hover:bg-blue-700 dark:hover:bg-blue-400'
            case 'walk_in':
                return 'bg-pink-600 dark:bg-pink-300 hover:bg-pink-700 dark:hover:bg-pink-400'
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