import { useState } from "react"

//components
import AddOnsDisplay from "./addOnsDisplay"
import OrderDisplay from "./orderDisplay"

//hooks
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"

//interface
import { IAddOnsCreateOrder, ICreateNewOrder } from "@/store/restaurant/order"
import { OrderStatus } from "@/common/types/restaurant/order.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"

interface MenuCreateUpdateOrderProps {
    menu: IGETMenuOrderSystemResponse,
    setOrder: (order: ICreateNewOrder) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
    order?: ICreateNewOrder
    handleOpen?: () => void
    printers?: IPrinters[]
    menuSections: IMenuSection[]
}

export default function CreateUpdateOrder({ menu, setOrder: setToOrders, getOneOrderTotal, order: oldOrder, handleOpen, printers, menuSections }: MenuCreateUpdateOrderProps) {

    const [order, setOrder] = useState<ICreateNewOrder>(oldOrder ? oldOrder : () => {
        const to_print_ips: string[] = []

        if (printers) {
            menu?.to_print_ids?.map(printer => {
                const printerData = printers.find(p => p.id === printer)
                if (printerData?.ip) {
                    to_print_ips.push(printerData?.ip)
                }
            })
        }
        return {
            id: Math.random().toString(36).substring(7),
            menu: menu?.title,
            menu_short_title: menu?.short_title,
            menu_id: menu?.id,
            quantity: 1,
            add_ons: [],
            price: menu?.value,
            mn_type: menu?.mn_type?.title,
            status: OrderStatus.ORDERED,
            mn_section: menu?.mn_type?.section?.title,
            to_print_ips
        }
    })

    const handleSetAddOns = (addOns: IAddOnsCreateOrder[]) => {
        setOrder(prev => ({
            ...prev,
            add_ons: addOns
        }))
    }

    const handleRemoveAddOns = (add_ons_id: string) => {
        setOrder(prev => ({
            ...prev,
            add_ons: order.add_ons.filter(a => a.add_ons_opt_id !== add_ons_id)
        }))
    }

    const handleChangeQuantity = (increase: boolean) => {
        setOrder(prev => ({
            ...prev,
            quantity: prev?.quantity === 1 && !increase ? 1 : increase ? prev.quantity + 1 : prev.quantity - 1
        }))
    }

    const handleUpdateMnSection = (mn_section: string) => {
        setOrder(prev => ({
            ...prev,
            mn_section
        }))
    }

    return (
        <div className='relative grid grid-cols-1 gap-4 h-full md:grid-cols-[1fr,220px]'>
            <AddOnsDisplay
                menu={menu}
                order={order}
                handleSetAddOns={handleSetAddOns}
                handleChangeQuantity={handleChangeQuantity}
                setOrder={(order) => {
                    setToOrders(order)
                    handleOpen && handleOpen()
                }}
                getOneOrderTotal={getOneOrderTotal}
                menuSections={menuSections}
                updateMnSection={handleUpdateMnSection}
            />
            <OrderDisplay
                menu={menu}
                order={order}
                handleRemoveAddOns={handleRemoveAddOns}
                handleChangeQuantity={handleChangeQuantity}
                getOneOrderTotal={getOneOrderTotal}
                setOrder={(order) => {
                    setToOrders(order)
                    handleOpen && handleOpen()
                }}
            />
        </div>
    )
}