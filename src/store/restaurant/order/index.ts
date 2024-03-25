import { OrderStatus } from '@/common/types/restaurant/order.interface';
import { create, } from 'zustand';

export interface IAddOnsCreateOrder {
    add_ons_id: string
    add_ons_opt_id: string
    title: string
    price: number
    is_mandatory: boolean
}

export interface ICreateNewOrder {
    id: string

    status: OrderStatus;
    quantity: number
    paid?: number

    mn_type: string
    mn_section: string

    price: number
    add_ons: IAddOnsCreateOrder[]

    menu: string,
    menu_id: string
    menu_short_title: string

    to_print_ips: string[]
}

export interface IGetOrderFilter {
    id?: string
}
interface OrderStateProps {
    order: ICreateNewOrder[]
    resetOrder: () => void
    setOrder: (order: ICreateNewOrder) => void
    updateOrderQuantity: (order: ICreateNewOrder, incrise: boolean) => void
    deleteOrder: (orderId: string) => void
    replaceOrder: (order: ICreateNewOrder) => void
}


export const useOrderStore = create<OrderStateProps>((set): OrderStateProps => ({
    order: [],
    resetOrder: () => set({ order: [] }),
    setOrder: (order) => set((state) => {
        const orderExists = state.order.find(o => o.id === order.id)

        if (orderExists) {
            const addQuantity = orderExists.quantity + order.quantity
            return { order: state.order.map(o => o.id === order.id ? { ...o, quantity: addQuantity } : o) }
        }
        return {
            order: [...state.order, order]
        }
    }),
    updateOrderQuantity: (order, incrise) => set((state) => {
        const orderExists = state.order.find(o => o.id === order.id)
        if (orderExists) {
            const quantity = incrise ? orderExists.quantity + 1 : orderExists.quantity - 1
            return { order: state.order.map(o => o.id === order.id ? { ...o, quantity } : o) }
        }

        return { order: state.order }
    }),
    replaceOrder: (order) => set((state) => ({
        order: state.order.map(o => o.id === order.id ? order : o)
    })),
    deleteOrder: (orderId) => set((state) => ({
        order: state.order.filter(o => o.id !== orderId)
    }))
}));
