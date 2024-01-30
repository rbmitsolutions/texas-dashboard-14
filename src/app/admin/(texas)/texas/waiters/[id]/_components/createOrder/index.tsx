import { useState } from "react"

//components
import AddOnsDisplay, { IAddOnsCreateOrder } from "./addOnsDisplay"

//hooks
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"

//interface
import { IMenuAddOns, IMenuAddOnsOption } from "@/common/types/restaurant/menu.interface"
import OrderDisplay from "./orderDisplay"

export interface IHandleAddOnsSelection {
    option: IMenuAddOnsOption
    addOn: IMenuAddOns
    to: 'add' | 'remove' | 'replace'
}

export interface ICreateNewOrder {
    quantity: number
    add_ons: IAddOnsCreateOrder[]
}

interface MenuCreateOrderProps {
    menu: IGETMenuOrderSystemResponse
}

export default function CreateOrder({ menu }: MenuCreateOrderProps) {
    const [order, setOrder] = useState<ICreateNewOrder>({
        quantity: 1,
        add_ons: []
    })

    const handleSetAddOns = (addOns: IAddOnsCreateOrder[]) => {
        setOrder({
            ...order,
            add_ons: addOns
        })
    }

    return (
        <div className='relative grid grid-cols-1 gap-4 h-full md:grid-cols-[1fr,220px]'>
            <AddOnsDisplay menu={menu} order={order} handleSetAddOns={handleSetAddOns}/>
            <OrderDisplay menu={menu} order={order} />
        </div>
    )
}