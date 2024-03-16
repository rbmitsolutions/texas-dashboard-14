import { useState } from "react"

//libs
import Icon from "@/common/libs/lucida-icon"

//components
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import CreateUpdateOrder from "../../waiters/[id]/_components/createUpdateOrder"

//interface
import { IMenu, IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

interface UpdateNewOrderDialogProps {
    replaceOrder: (order: ICreateNewOrder) => void,
    updateOrderQuantity: (order: ICreateNewOrder, isIncrement: boolean) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
    order: ICreateNewOrder
    menuItem: IMenu
    menuSections: IMenuSection[]
}

export default function UpdateNewOrderDialog({ replaceOrder, updateOrderQuantity, getOneOrderTotal, order, menuItem, menuSections }: UpdateNewOrderDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleUpdateOrder = (order: ICreateNewOrder) => {
        replaceOrder(order)
    }

    return (
        <div className='flex justify-between items-center'>
            <AlertDialog
                open={isOpen}
                onOpenChange={handleOpen}
            >
                <AlertDialogTrigger asChild>
                    <Button
                        variant='pink'
                        size='iconExSm'
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
                            menuSections={menuSections}
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
            <div className='flex items-center'>
                <Button
                    disabled={order?.quantity === 1 || !updateOrderQuantity}
                    onClick={() => updateOrderQuantity(order as unknown as ICreateNewOrder, false)}
                    size='iconExSm'
                >
                    <Icon name='Minus' size={14} />
                </Button>
                <span className='text-center w-8'>{order?.quantity}</span>
                <Button
                    disabled={!updateOrderQuantity}
                    onClick={() => updateOrderQuantity(order as unknown as ICreateNewOrder, true)}
                    size='iconExSm'
                >
                    <Icon name='Plus' size={14} />
                </Button>
            </div>
        </div>
    )
}