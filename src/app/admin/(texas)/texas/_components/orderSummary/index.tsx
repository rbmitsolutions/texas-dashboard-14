import { useEffect, useState } from "react";

//libs
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon";

//components
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import CreateUpdateOrder from "../../waiters/[id]/_components/createUpdateOrder";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { Button } from "@/components/ui/button"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { IOrder } from "@/common/types/restaurant/order.interface";
import { ICreateNewOrder } from "@/store/restaurant/order";

interface IOrderSummary {
    order: IOrder[] | ICreateNewOrder[]
    updateOrder?: {
        deleteOrder: (id: string) => void
        updateOrderQuantity: (order: ICreateNewOrder, isIncrement: boolean) => void
        replaceOrder: (order: ICreateNewOrder) => void,
        menu: IGETMenuOrderSystemResponse[]
    }
    getOneOrderTotal: (order: ICreateNewOrder) => number
    sections: IMenuSection[]
}

export const OrderSummary = ({ order, updateOrder, getOneOrderTotal, sections }: IOrderSummary) => {
    const [isOpen, setIsOpen] = useState(false)
    
    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleUpdateOrder = (order: ICreateNewOrder) => {
        updateOrder && updateOrder?.replaceOrder(order)
    }

    if (order?.length === 0) {
        return (
            <div className='flex justify-center items-center h-full rounded-lg'>
                <h1 className='text-sm'>No orders</h1>
            </div>
        )
    }

    return (
        sections?.map(s => {
            const mn_types = s?.types?.map(t => t?.title)
            const orders = order?.filter(o => mn_types?.includes(o?.mn_type as string))

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
                                key={order?.id}
                                className={cn('flex flex-col gap-2 p-2 rounded-r-lg border-l-8 shadow-md bg-slate-100 dark:bg-slate-950/45', 'border-orange-400')}
                            >
                                <div className='flex-container justify-between gap-2'>
                                    <strong>{order?.menu_short_title}</strong>
                                    <Button
                                        onClick={() => updateOrder?.deleteOrder(order?.id)}
                                        size='iconExSm'
                                        variant='destructive'
                                        disabled={!updateOrder}
                                    >
                                        <Icon name='Trash' />
                                    </Button>
                                </div>
                                {order?.add_ons?.map(a => {
                                    return (
                                        <div key={a?.add_ons_opt_id} className='flex flex-col bg-background-soft p-2 rounded-lg'>
                                            <small >- {a?.title}</small>
                                            {a?.price > 0 && <small className='text-red-500'>+{convertCentsToEuro(a?.price)}</small>}

                                        </div>
                                    )
                                })}
                                <small className='text-green-500 mt-1 text-lg'>{convertCentsToEuro(getOneOrderTotal(order as unknown as ICreateNewOrder) || 0)}</small>
                                <div className='flex justify-between items-center mt-1'>
                                    {updateOrder ?
                                        <AlertDialog
                                            open={isOpen}
                                            onOpenChange={handleOpen}
                                        >
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant='orange'
                                                    size='iconExSm'
                                                    disabled={menuItem?.add_ons?.length === 0}
                                                    onClick={() => handleOpen()}
                                                >
                                                    <Icon name='Pen' />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className='h-[600px] md:!min-w-[900px]'>
                                                <div className='mt-4'>
                                                    <CreateUpdateOrder
                                                        menu={menuItem!}
                                                        handleOpen={handleOpen}
                                                        order={order as unknown as ICreateNewOrder}
                                                        getOneOrderTotal={getOneOrderTotal}
                                                        setOrder={handleUpdateOrder}
                                                    />
                                                </div>
                                                <AlertDialogCancel asChild>
                                                    <Button
                                                        className='absolute p-0 top-0 left-0'
                                                        type='button'
                                                        size='icon'
                                                        variant='ghost'
                                                    >
                                                        <Icon name='X' />
                                                    </Button>
                                                </AlertDialogCancel>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        :
                                        <Button
                                            variant='orange'
                                            size='iconExSm'
                                            disabled={true}
                                        >
                                            <Icon name='Pen' />
                                        </Button>
                                    }
                                    <div className='flex items-center'>
                                        <Button
                                            disabled={order?.quantity === 1 || !updateOrder}
                                            onClick={() => updateOrder?.updateOrderQuantity(order as unknown as ICreateNewOrder, false)}
                                            size='iconExSm'
                                        >
                                            <Icon name='Minus' size={14} />
                                        </Button>
                                        <span className='text-center w-8'>{order?.quantity}</span>
                                        <Button
                                            disabled={!updateOrder}
                                            onClick={() => updateOrder?.updateOrderQuantity(order as unknown as ICreateNewOrder, true)}
                                            size='iconExSm'
                                        >
                                            <Icon name='Plus' size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        })
    )
};
