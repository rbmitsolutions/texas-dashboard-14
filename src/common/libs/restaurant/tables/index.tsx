import { TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { ButtonProps } from "@/components/ui/button"

export const getTableStatusVariant = (status: TableMealStatus): ButtonProps['variant'] => {
    switch (status) {
        case TableMealStatus.WAITING:
            return 'orange'
        case TableMealStatus.STARTERS:
            return 'purple'
        case TableMealStatus.MAIN:
            return 'green'
        case TableMealStatus.ALL_TOGETHER:
            return 'pink'
        case TableMealStatus.DESSERT:
            return 'yellow'
        case TableMealStatus.PREPARING:
            return 'blue'
        default:
            return 'green'
    }
}

