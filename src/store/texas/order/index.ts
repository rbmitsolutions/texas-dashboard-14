import { IOrderStatus } from '@/common/types/restaurant/order.interface';
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

    status: IOrderStatus;
    quantity: number

    mn_type: string

    price: number
    add_ons: IAddOnsCreateOrder[]
    
    menu: string,
    menu_id: string
    menu_short_title: string

    to_print_ids: string[]
}


interface OrderSytemNewOrderState {
    order: ICreateNewOrder[] 
    resetOrder: () => void
    setOrder: (order: ICreateNewOrder) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
    updateOrderQuantity: (order: ICreateNewOrder, incrise: boolean) => void
    deleteOrder: (orderId: string) => void
    getOrderTotal: (orders: ICreateNewOrder[]) => number
    replaceOrder: (order: ICreateNewOrder) => void
}


export const useOrderTablesNewOrderStore = create<OrderSytemNewOrderState>((set): OrderSytemNewOrderState => ({
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
    getOneOrderTotal: (order) => {
        const addOnsTotal = order.add_ons.reduce((acc, curr) => acc + curr.price, 0)
        return (order.price + addOnsTotal) * order.quantity
    },
    getOrderTotal: (orders) => {
        let total = 0

        orders.forEach(order => {
            const addOnsTotal = order.add_ons.reduce((acc, curr) => acc + curr.price, 0)
            total += (order.price + addOnsTotal) * order.quantity
        })

        return total
    },
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
