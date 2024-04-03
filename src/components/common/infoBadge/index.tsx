//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import { Badge } from "@/components/ui/badge"

//inteface
import { IBookingStatus, IReviewsType } from "@/common/types/restaurant/bookings.interface"
import { TransactionsStatus } from "@/common/types/company/transactions.interface"
import { IGiftCardStatus } from "@/common/types/restaurant/giftcard.interface"
import { IRequestsStatus } from "@/common/types/company/requests.interface"
import { TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { IFilesAs } from "@/common/types/company/files.interface"

interface InfoBadgeProps {
    status: IBookingStatus | IFilesAs | IReviewsType | IRequestsStatus | IGiftCardStatus | TransactionsStatus | TableMealStatus | 'done' | 'pending'
    className?: string
}

export default function InfoBadge({ status, className }: InfoBadgeProps) {

    const statusColor = (status: InfoBadgeProps['status']) => {
        switch (status.toLocaleLowerCase().replace(" ", "")) {
            case 'working':
            case 'pending':
            case 'waiting':
            case 'unsent':
            case 'contract':
            case TableMealStatus.WAITING:
                return 'bg-orange-600 dark:bg-orange-300 hover:bg-orange-700 dark:hover:bg-orange-400'
            case 'approved':
            case 'done':
            case 'restaurant':
            case 'confirmed':
            case 'contract-sgined':
            case 'avatar':
            case 'report':
            case 'menu':
            case TableMealStatus.MAIN:
                return 'bg-green-600 dark:bg-green-300 hover:bg-green-700 dark:hover:bg-green-400'
            case 'denied':
            case 'unconfirmed':
            case 'spent':
            case 'contract-filed':
                return 'bg-red-600 dark:bg-red-300 hover:bg-red-700 dark:hover:bg-red-400'
            case 'canceled':
            case 'cancelled':
            case 'cv':
            case TableMealStatus.DESSERT:
                return 'bg-yellow-600 dark:bg-yellow-300 hover:bg-yellow-700 dark:hover:bg-yellow-400'
            case 'arrived':
            case 'staff':
            case 'sent':
            case 'document':
            case TableMealStatus.STARTERS:
                return 'bg-purple-600 dark:bg-purple-300 hover:bg-purple-700 dark:hover:bg-purple-400'
            case 'walk_in':
            case TableMealStatus.ALL_TOGETHER.toLocaleLowerCase().replace(" ", ""):
                return 'bg-pink-600 dark:bg-pink-300 hover:bg-pink-700 dark:hover:bg-pink-400'
            default:
                return 'bg-green-600 dark:bg-green-300 hover:bg-green-700 dark:hover:bg-green-400'
        }
    }

    return (
        <Badge className={cn('capitalize', className, statusColor(status))}>
            {status?.toLowerCase()}
        </Badge>
    )
}