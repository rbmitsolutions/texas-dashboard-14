
//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import { Badge } from "@/components/ui/badge"

//interface
import { IOrder } from "@/common/types/restaurant/order.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"
import { getOrderTotal } from "@/common/libs/restaurant/order"

interface OrderQuantitiesProps {
    order: IOrder
    splitBill?: {
        handleAddToBill?: (order: IOrder) => void
        handleRemoveFromBill?: (orderId: string) => void
    }
    showPrice?: boolean
}

export default function OrderQuantities({ order, splitBill, showPrice = true }: OrderQuantitiesProps) {

    const orderTotal = getOrderTotal({ ...order, paid: 0 } as unknown as ICreateNewOrder)

    return (
        <div className='flex-container justify-between items-center'>
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1'>
                    <small>
                        {order?.quantity} x
                    </small>
                    {showPrice &&
                        <small >{convertCentsToEuro(orderTotal / order?.quantity)} </small >
                    }
                </div>

                {(order?.paid > 0) &&

                    <div className='flex items-center gap-1'>
                        <Badge
                            className="bg-green-500 py-0 px-1"
                        >{order?.paid} x</Badge>
                        <small >
                            {splitBill ? 'to Pay' : 'Paid'}
                        </small>
                    </div>
                }
            </div>
            {
                showPrice &&
                <strong className='text-xl text-green-600'>
                    {convertCentsToEuro(orderTotal)}
                </strong>
            }
        </div >
    )
}