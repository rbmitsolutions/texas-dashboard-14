import { UseMutateFunction } from "react-query"
import { useState } from "react"

//components
import { getOrderStatusVariant } from "@/common/libs/restaurant/order"
import { IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface"
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

interface UpdateAllOrderStatusProps {
    orderController: IOrderController
    onUpdate: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function UpdateAllOrderStatus({ orderController, onUpdate }: UpdateAllOrderStatusProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleUpdate = async (status: OrderStatus) => {
        await onUpdate({
            order: {
                many: {
                    id: {
                        in: orderController?.orders?.filter(order => order.status === 'ordered').map(o => o.id)
                    },
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
                    variant='orange'
                    className='w-full'
                    onClick={() => setIsOpen(true)}
                >
                    Update All Orders
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className='flex-col-container'>
                    <i>
                        This action will only modify the orders with the status &ldquo;Ordered.&ldquo;
                    </i>
                    {Object.values(OrderStatus).map(status => {
                        if (status !== OrderStatus.PAID && status !== OrderStatus.ORDERED)
                            return (
                                <Button
                                    key={status}
                                    className='capitalize h-14'
                                    variant={getOrderStatusVariant(status)}
                                    onClick={() => handleUpdate(status)}
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