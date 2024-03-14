'use client'
import { UseMutateFunction } from "react-query";

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//components
import UpdateAllOrderStatus from "./updateAllOrders";
import { IOrderSummary, OrderSummary } from ".";
import { Button } from "@/components/ui/button";
import ToPrintButton from "./toPrintButton";

//interface
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { IOrderController } from "@/common/types/restaurant/order.interface";
import { IPrinters } from "@/common/types/restaurant/printers.interface";

interface FullOrderControllerProps {
    orderController: IOrderController
    orderSumary: IOrderSummary
    onOrdersUpdate?: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    printers: IPrinters[]
}
export default function FullOrderController({ orderController, orderSumary, onOrdersUpdate, printers }: FullOrderControllerProps) {
    const hasOrdersWithOrderedStatus = orderController?.orders?.filter(order => order.status === 'ordered')

    return (
        <div
            key={orderController?.id}
            className='p-3 rounded-lg bg-background-soft'
        >
            <div className='flex items-center justify-between mb-2'>
                <div>
                    <small className="line-clamp-1">{orderController?.waiter}</small>
                    <small className="text-end">{formatDate({
                        date: orderController?.created_at,
                        f: 'HH:mm:ss',
                        iso: false
                    })}</small>
                </div>
                <Button>
                    {orderController?.number}
                </Button>
            </div>
            <div className='flex justify-center w-full'>
                <Button
                    size='sm'
                    className='justify-self-center mb-2'
                    variant='purple'
                >
                    Pass {orderController?.pass}
                </Button>
            </div>
            <OrderSummary
                {...orderSumary}
            />
            <div className='flex-container justify-between mt-2'>
                <ToPrintButton
                    orderController={orderController}
                    printers={printers}
                />
                {(onOrdersUpdate && hasOrdersWithOrderedStatus?.length > 0) &&
                    <UpdateAllOrderStatus
                        orderController={orderController}
                        onUpdate={onOrdersUpdate}
                    />
                }
            </div>
        </div>
    )
}