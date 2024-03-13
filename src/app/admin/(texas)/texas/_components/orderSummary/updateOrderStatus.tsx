import { UseMutateFunction } from "react-query"
import { useState } from "react"

//components
import { getOrderStatusVariant } from "@/common/libs/restaurant/order"
import { IOrder, OrderStatus } from "@/common/types/restaurant/order.interface"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

//interface
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"

interface UpdateOrderStatusProps {
    order: IOrder
    onUpdate: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function UpdateOrderStatus({ order, onUpdate }: UpdateOrderStatusProps) {
    const [isOpen, setIsOpen] = useState(false)
    
    const handleUpdate = async (order: IOrder, status: OrderStatus) => {
        await onUpdate({
            order: {
                order: {
                    id: order.id,
                    data: {
                        status
                    }
                }
            }
        }, {
            onSuccess: () => {
                setIsOpen(false)
            }
        })
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button
                    leftIcon="RefreshCw"
                    size='sm'
                    variant='secondary'
                    onClick={() => setIsOpen(true)}
                    className='w-20'
                >
                    Status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{order?.menu}</DialogTitle>
                </DialogHeader>
                <div className='flex-col-container'>
                    {Object.values(OrderStatus).map(status => {
                        if (status !== OrderStatus.PAID && status !== OrderStatus.ORDERED)
                            return (
                                <Button
                                    key={status}
                                    className='capitalize h-14 '
                                    variant={getOrderStatusVariant(status)}
                                    onClick={() => handleUpdate(order, status)}
                                    type='button'
                                >
                                    {status}
                                </Button>
                            )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}