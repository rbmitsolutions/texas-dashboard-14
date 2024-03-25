import { UseMutateFunction } from "react-query";

//libs
import { getOrderStatusBorderColor } from "@/common/libs/restaurant/order";
import sortMenuSections from "@/common/libs/restaurant/menuSections";
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon";

//components
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import UpdateNewOrderDialog from "./updateNewOrderDialog";
import UpdateOrderStatus from "./updateOrderStatus";
import OrderQuantities from "./orderQuantities";
import { Button } from "@/components/ui/button"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { IOrder, OrderStatus } from "@/common/types/restaurant/order.interface";
import { IMenu, IMenuSection } from "@/common/types/restaurant/menu.interface";
import { ICreateNewOrder } from "@/store/restaurant/order";

export interface IOrderSummary {
    order: IOrder[] | ICreateNewOrder[]
    updateOrder?: {
        deleteOrder: (id: string) => void
        updateOrderQuantity: (order: ICreateNewOrder, isIncrement: boolean) => void
        replaceOrder: (order: ICreateNewOrder) => void,
        menu: IGETMenuOrderSystemResponse[]
    }
    splitBill?: {
        handleAddToBill?: (order: IOrder) => void
        handleRemoveFromBill?: (orderId: string) => void
    }
    updateOrderStatus?: {
        onUpdate: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    }
    menuSections: IMenuSection[]
    showPrice?: boolean
}

export const OrderSummary = ({ order, updateOrder, menuSections, splitBill, updateOrderStatus, showPrice = true }: IOrderSummary) => {

    if (order?.length === 0) {
        return (
            <strong className='text-sm'><i>No orders</i></strong>
        )
    }

    return (
        sortMenuSections(menuSections)?.map(s => {
        
            const orders = order?.filter(o => s?.title?.includes(o?.mn_section as string)).sort((a, b) => {
                return a?.menu_short_title?.localeCompare(b?.menu_short_title)
            })

            if (orders?.length === 0) return

            return (
                <div
                    key={s?.id}
                    className='flex-col-container p-2 rounded-lg'
                >
                    <small className='text-center'> === {s?.title} === </small>
                    {orders?.map(order => {
                        const menuItem = updateOrder?.menu.find(m => m.id === order?.menu_id)

                        return (
                            <div
                                id={`order-${order?.id}`}
                                key={order?.id}
                                className={cn('flex flex-col gap-2 p-2 rounded-r-lg border-2 border-l-8 shadow-md bg-slate-100 dark:bg-slate-950/45', getOrderStatusBorderColor(order?.status))}
                            >
                                <div className='flex-container justify-between gap-2'>
                                    <strong>{order?.menu_short_title}</strong>
                                    {updateOrder &&
                                        <Button
                                            onClick={() => updateOrder?.deleteOrder(order?.id)}
                                            size='iconExSm'
                                            variant='destructive'
                                        >
                                            <Icon name='Trash' />
                                        </Button>
                                    }
                                    {splitBill?.handleAddToBill &&
                                        <Button
                                            size='iconSm'
                                            onClick={() => splitBill?.handleAddToBill!(order as IOrder)}
                                            disabled={order?.quantity === order?.paid}
                                        >
                                            <Icon name='Plus' />
                                        </Button>
                                    }
                                    {splitBill?.handleRemoveFromBill &&
                                        <Button
                                            onClick={() => splitBill?.handleRemoveFromBill!(order?.id)}
                                            size='iconExSm'
                                            variant='destructive'
                                        >
                                            <Icon name='Trash' />
                                        </Button>
                                    }
                                </div>
                                {order?.add_ons?.map(a => {
                                    return (
                                        <div key={a?.add_ons_opt_id} className='flex flex-col bg-background-soft p-2 rounded-lg'>
                                            <small className='text-justify'>- {a?.title}</small>
                                            {a?.price > 0 && <small className='text-red-500'>+{convertCentsToEuro(a?.price)}</small>}
                                        </div>
                                    )
                                })}
                                <OrderQuantities
                                    order={order as IOrder}
                                    splitBill={splitBill}
                                    showPrice={showPrice}
                                />

                                {updateOrder &&
                                    <UpdateNewOrderDialog
                                        key={order?.id}
                                        order={order as ICreateNewOrder}
                                        updateOrderQuantity={updateOrder.updateOrderQuantity}
                                        replaceOrder={updateOrder.replaceOrder}
                                        menuItem={menuItem as IMenu || {} as IMenu}
                                        menuSections={menuSections}
                                    />
                                }

                                {(updateOrderStatus?.onUpdate && order?.status === OrderStatus.ORDERED) &&
                                    <UpdateOrderStatus
                                        order={order as IOrder}
                                        onUpdate={updateOrderStatus.onUpdate}
                                    />
                                }
                            </div>
                        )
                    })}
                </div>
            )
        })
    )
};
