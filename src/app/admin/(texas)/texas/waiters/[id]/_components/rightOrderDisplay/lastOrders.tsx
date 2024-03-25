import { UseMutateFunction } from "react-query"

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import FullOrderController from "../../../../_components/orderSummary/fullOrderController"
import { Button } from "@/components/ui/button"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

interface LastOrdersProps {
    ordersController: IOrderController[]
    menu: IGETMenuOrderSystemResponse[]
    menuSections: IMenuSection[]
    updateOrder: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    printers: IPrinters[]
}

export default function LastOrders({ ordersController, menu, menuSections, updateOrder, printers }: LastOrdersProps) {
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
                            <FullOrderController
                                key={oc?.id}
                                orderController={oc}
                                onOrdersUpdate={updateOrder}
                                orderSumary={{
                                    order: oc?.orders?.map(o => {
                                        const menuItem = menu?.find(m => m.id === o.menu_id)
                                        return {
                                            ...o,
                                            menu: menuItem?.title,
                                            menu_id: menuItem?.id,
                                            menu_short_title: menuItem?.short_title,
                                        }
                                    }) as unknown as IOrder[],
                                    menuSections,
                                    updateOrderStatus: {
                                        onUpdate: updateOrder,
                                    }
                                }}
                                printers={printers}
                            />
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}