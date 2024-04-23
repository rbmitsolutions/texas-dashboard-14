//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import LinkButton from "@/components/common/linkButton";
import Icon from "@/common/libs/lucida-icon";

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

//interfaces
import { IStockOrders, IStockProducts } from "@/common/types/restaurant/stock.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types";

interface PedingOrdersProps {
    orders: IStockOrders[]
    product: IStockProducts
}

export default function PedingOrders({ product, orders }: PedingOrdersProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='orange'
                    size='iconSm'
                >
                    <Icon name='FileText' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Orders Peding</DialogTitle>
                </DialogHeader>
                <div>
                    {orders.map((order, index) => {
                        return (
                            <div key={index} className='grid grid-cols-[1fr,auto,auto] gap-4 p-2 border-b border-background-soft hover:opacity-80'>
                                <div>
                                    <strong className='block'>{product?.title}</strong>
                                    <small className='block'>{formatDate({
                                        date: order?.created_at,
                                        f: 'dd/MM/yy'
                                    })}</small>
                                </div>
                                <div >
                                    <strong className='block'>{order?.product_quantity}</strong>
                                </div>
                                <LinkButton
                                    href={`${RedirectTo.STOCK_ORDER_CONTROLLER_PROFILE}/${order?.order_controller_id}`}

                                />
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>

    )
}