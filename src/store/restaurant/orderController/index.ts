import { IOrder, IOrderController, OrderStatus } from '@/common/types/restaurant/order.interface';
import { create } from 'zustand';

export interface OrderControllerFilterProps {
    table_id: string
    orders?: {
        status: OrderStatus[]
    }
}

interface OrderControllerStateProps {
    orderControllers: IOrderController[]
    setOrderControllers: (orderControllers: IOrderController[]) => void
    getOrderControllers: (filter: OrderControllerFilterProps) => IOrderController[]
    getTotalOfOrdersByTableId: (table_id: string) => number
}

export const useOrderControllerStore = create<OrderControllerStateProps>((set) => ({
    orderControllers: [],
    setOrderControllers: (orderControllers) => set({ orderControllers }),
    getOrderControllers: (filter) => {
        const { table_id, orders } = filter
        let orderControllers: IOrderController[] = [...useOrderControllerStore.getState().orderControllers]

        if (table_id?.length > 0) {
            orderControllers = orderControllers.filter((orderController) => orderController.table_id === table_id)
        }

        if (orders) {
            orderControllers = orderControllers.filter((orderController) => {
                return orderController.orders.some((order) => orders.status.includes(order.status))
            })
        }

        return orderControllers
    },
    getTotalOfOrdersByTableId: (table_id) => {
        const orderControllers = useOrderControllerStore.getState().orderControllers.filter((orderController) => orderController.table_id === table_id)

        let total = 0

        orderControllers.forEach((orderController) => {
            let orderT = 0

            orderController.orders.forEach(order => {
                if (order?.status === OrderStatus.ORDERED || order?.status === OrderStatus.DELIVERED || order?.status === OrderStatus.PAID) {
                    const addOnsTotal = order.add_ons.reduce((acc, curr) => acc + curr.price, 0)
                    orderT += (order.price + addOnsTotal) * order.quantity
                }
            })

            total += orderT
        })

        return total
    },
}));
