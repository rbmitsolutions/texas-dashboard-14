//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

interface ClosedTablesProps {
}

export default function ClosedTables({ }: ClosedTablesProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant='pink'
                    className='w-full h-16'
                >
                    <Icon name='UtensilsCrossed' />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Last Orders</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 p-2 overflow-auto scrollbar-thin">

                </div>
            </SheetContent>
        </Sheet>
    )
}