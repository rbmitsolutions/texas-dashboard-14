//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { OrderSummary } from "../../../../_components/orderSummary"
import { Button } from "@/components/ui/button"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

interface LastOrdersProps {
    ordersController: IOrderController[]
    menu: IGETMenuOrderSystemResponse[]
    getOneOrderTotal: (order: ICreateNewOrder) => number
    sections: IMenuSection[]
}

export default function LastOrders({ ordersController, menu, getOneOrderTotal, sections }: LastOrdersProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant='blue'
                    className='w-full h-12'
                    leftIcon='Utensils'
                >
                    {ordersController?.length} {ordersController?.length === 1 ? 'Order' : 'Orders'}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Last Orders</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 p-2 overflow-auto scrollbar-thin">
                    {ordersController?.map(oc => {
                        return (
                            <div
                                key={oc?.id}
                                className='flex-col-container bg-foreground/5 p-4 rounded-lg'
                            >
                                <div className='flex-container justify-between items-center mb-2'>
                                    <strong className='line-clamp-1'>{oc?.waiter}</strong>
                                    <small>
                                        {formatDate({
                                            date: oc?.created_at,
                                            f: 'HH:mm:ss'
                                        })}
                                    </small>
                                </div>
                                {OrderSummary({
                                    order: oc?.orders?.map(o => {
                                        const menuItem = menu?.find(m => m.id === o.menu_id)
                                        return {
                                            ...o,
                                            menu: menuItem?.title,
                                            menu_id: menuItem?.id,
                                            menu_short_title: menuItem?.short_title,
                                        }
                                    }) as unknown as IOrder[],
                                    getOneOrderTotal,
                                    sections
                                })}
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}