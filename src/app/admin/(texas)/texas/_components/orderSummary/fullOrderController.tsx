'use client'

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//components
import { IOrderSummary, OrderSummary } from ".";
import { Button } from "@/components/ui/button";
import ToPrintButton from "./toPrintButton";

//interface
import { IOrderController } from "@/common/types/restaurant/order.interface";
import { IPrinters } from "@/common/types/restaurant/printers.interface";
import InfoBadge from "@/components/common/infoBadge";

interface FullOrderControllerProps {
    orderController: IOrderController
    orderSumary: IOrderSummary
    printers?: IPrinters[]
}
export default function FullOrderController({ orderController, orderSumary, printers }: FullOrderControllerProps) {

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
                <div className='space-x-1'>
                    <Button
                        className='justify-self-center mb-2'
                        variant='purple'
                    >
                        {orderController?.pass}
                    </Button>
                </div>
            </div>
            {orderController?.table &&
                <div className='flex justify-center items-center w-full gap-2'>
                    <Button
                        size='sm'
                        className='justify-self-center'
                        variant='green'
                    >
                        Table {orderController?.table?.number}
                    </Button>
                    <InfoBadge
                        status={orderController?.table?.meal_status}
                    />
                </div>
            }

            <OrderSummary
                {...orderSumary}
            />

            <div className='flex-container justify-between mt-2'>
                {printers &&
                    <ToPrintButton
                        orderController={orderController}
                        printers={printers}
                    />
                }
            </div>
        </div>
    )
}