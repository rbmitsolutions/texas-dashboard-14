
//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import { Badge } from "@/components/ui/badge"

//interface
import { IOrder } from "@/common/types/restaurant/order.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

interface OrderQuantitiesProps {
    order: IOrder
    getOneOrderTotal: (order: ICreateNewOrder) => number
    splitBill?: {
        handleAddToBill?: (order: IOrder) => void
        handleRemoveFromBill?: (orderId: string) => void
    }
    showPrice?: boolean
}

export default function OrderQuantities({ order, getOneOrderTotal, splitBill, showPrice = true }: OrderQuantitiesProps) {

    const orderTotal = getOneOrderTotal({ ...order, paid: 0 } as unknown as ICreateNewOrder)

    //todo: split bill
    // if (splitBill?.handleAddToBill) {
    //     return (
    //         <div className='flex items-center justify-between gap-1'>
    //             <small className='text-green-500 text-lg text-end font-bold'>{convertCentsToEuro(getOneOrderTotal({
    //                 ...order,
    //             } as unknown as ICreateNewOrder) || 0)}</small>
    //             {/* : */}
    //             <small className='text-green-500 text-lg text-end font-bold'>{convertCentsToEuro(getOneOrderTotal({
    //                 ...order,
    //                 paid: 0
    //             } as unknown as ICreateNewOrder) || 0)}</small>
    //         </div>
    //     )
    // }

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

                {/* {(order?.paid > 0) &&
                todo: split bill
                <div className='flex items-center gap-1'>
                <Badge
                className="bg-green-500 py-0 px-1"
                >{order?.paid} x</Badge>
                <small >
                paid
                </small>
                </div>
            } */}
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