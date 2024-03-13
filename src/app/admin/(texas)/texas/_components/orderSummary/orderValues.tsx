//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { cn } from "@/common/libs/shadcn/utils";

//interface
import { IOrder, OrderStatus } from "@/common/types/restaurant/order.interface";
import { ICreateNewOrder } from "@/store/restaurant/order";

interface OrderValuesProps {
    order: IOrder
    getOneOrderTotal: (order: ICreateNewOrder) => number
}

export default function OrderValues({ order, getOneOrderTotal }: OrderValuesProps) {
    const status = order?.status === OrderStatus.ORDERED || order?.status === OrderStatus.DELIVERED
    const paidBg = order?.quantity <= order?.paid ? 'text-foreground/50' : 'text-green-500 font-bold'

    if (status) {
        return (
            <div className='flex flex-col'>
                <small className={cn('text-lg text-end', paidBg)}>
                    {convertCentsToEuro(getOneOrderTotal(order as unknown as ICreateNewOrder) || 0)}
                </small>
            </div>
        )
    }

    return (
        <small className='text-lg text-endtext-foreground/50'>
            {convertCentsToEuro(0)}
        </small>
    )

}