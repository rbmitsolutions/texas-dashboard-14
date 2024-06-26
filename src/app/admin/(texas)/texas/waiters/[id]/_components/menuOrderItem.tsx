import { memo, useState } from "react";
import Icon from "@/common/libs/lucida-icon";

//libs
import { scrollToOrder } from "@/common/libs/restaurant/order";

//components
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import MenuOptionsComponent from "./menuOptionsComponent";
import { Button } from "@/components/ui/button";
import CreateUpdateOrder from "./createUpdateOrder";

//hooks
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IGETFilterMenuOrderSystem } from "@/hooks/useOrderSystemHooks";
import { OrderStatus } from "@/common/types/restaurant/order.interface";
import { IPrinters } from "@/common/types/restaurant/printers.interface";
import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { ICreateNewOrder } from "@/store/restaurant/order";

interface MenuOrderItemProps {
    menu: IGETMenuOrderSystemResponse
    menuData: IGETMenuOrderSystemResponse[]
    getFilteredOrderSystemMenu: (data: IGETFilterMenuOrderSystem) => IGETMenuOrderSystemResponse[]
    setOrder: (order: ICreateNewOrder) => void
    updateOrderQuantity: (order: ICreateNewOrder, incrise: boolean) => void
    order: ICreateNewOrder[]
    printers: IPrinters[]
    menuSections: IMenuSection[]
}

export function MenuOrderItem({ menu, menuData, order, setOrder, updateOrderQuantity, getFilteredOrderSystemMenu, printers, menuSections }: MenuOrderItemProps) {
    const [menuItem, setMenuItem] = useState<IGETMenuOrderSystemResponse>(menu)
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        if (menuItem?.f_options?.length > 0) {
            setStep(1)
        }
        if (menuItem?.add_ons?.length === 0) {
            if (isOpen) {
                setIsOpen(!isOpen)
            }

            const orderExists = order?.find(o => o.menu_id === menuItem?.id)
            if (orderExists) {
                scrollToOrder(orderExists.id)
                updateOrderQuantity(orderExists, true)
                return
            }

            const to_print_ips: string[] = menuItem?.to_print_ids?.map(printer => {
                const printerData = printers?.find(p => p.id === printer)
                return printerData?.ip || ''
            })

            const newOrder: ICreateNewOrder = {
                id: Math.random().toString(36).substring(7),
                add_ons: [],
                menu: menu?.title,
                menu_id: menu?.id,
                quantity: 1,
                menu_short_title: menu?.short_title,
                price: menu?.value,
                status: OrderStatus.ORDERED,
                mn_type: menu?.mn_type?.title,
                mn_section: menu?.mn_type?.section?.title,
                total: 0,
                to_print_ips
            }

            setOrder(newOrder as ICreateNewOrder)
            scrollToOrder(newOrder.id)

            return
        }

        setIsOpen(!isOpen)
        setMenuItem(menu)
    }

    const updateMenuItem = (option: IGETMenuOrderSystemResponse) => {
        setStep(0)
        setMenuItem(option)
    }


    const renderContent = () => {
        switch (step) {
            case 0:
                return <CreateUpdateOrder
                    menu={menuItem}
                    setOrder={(order: ICreateNewOrder) => {
                        setOrder(order)
                        updateMenuItem(menu)
                        setIsOpen(false)

                    }}
                    printers={printers}
                    menuSections={menuSections}
                />
            case 1: {
                const options = getFilteredOrderSystemMenu({
                    menuItems: menuData,
                    menuFilter: {
                        id: [...menuItem?.f_options?.map((item) => item?.id)],
                        sort: {
                            options_priority: true
                        }
                    }
                })
                return <MenuOptionsComponent options={options} updateMenuItem={updateMenuItem} />
            }
            default:
                return <h1>Default</h1>
        }
    }

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={handleOpen}
        >
            <AlertDialogTrigger asChild>
                <Button
                    variant='blue'
                    type='button'
                    className='flex-container-center justify-center min-h-40 max-h-60 h-full rounded-xl border-2 text-wrap'
                >
                    <h1>{menuItem?.short_title}</h1>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='h-[600px] md:!min-w-[900px]'>
                <div className='mt-4'>
                    {renderContent()}
                </div>
                <Button
                    className='absolute p-0 top-0 left-0'
                    type='button'
                    size='icon'
                    variant='ghost'
                    onClick={handleOpen}
                >
                    <Icon name='X' />
                </Button>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default memo(MenuOrderItem)