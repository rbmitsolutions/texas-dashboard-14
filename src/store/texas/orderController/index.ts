import { IOrderController } from '@/common/types/restaurant/order.interface';
import { create } from 'zustand';

interface OrderControllerState {
    orderControllers: IOrderController[]
    setOrderControllers: (orderControllers: IOrderController[]) => void
    orderControllerFilter: {
        table_id: string
    },
    setOrderControllerFilter: (filter: { table_id: string }) => void
    getFilteredOrderControllers: (filter: OrderControllerState['orderControllerFilter']) => IOrderController[]
    getTotalOfOrdersByTableId: (table_id: string) => number
}

export const useOrderSystemOrderControllerStore = create<OrderControllerState>((set) => ({
    orderControllers: [],
    setOrderControllers: (orderControllers) => set({ orderControllers }),
    orderControllerFilter: {
        table_id: ''
    },
    setOrderControllerFilter: (filter) => set({ orderControllerFilter: filter }),
    getFilteredOrderControllers: (filter) => {
        const { table_id } = filter
        let orderControllers: IOrderController[] = [...useOrderSystemOrderControllerStore.getState().orderControllers]

        if (table_id.length > 0) {
            orderControllers = orderControllers.filter((orderController) => orderController.table_id === table_id)
        }

        return orderControllers
    },
    getTotalOfOrdersByTableId: (table_id) => {
        const orderControllers = useOrderSystemOrderControllerStore.getState().orderControllers.filter((orderController) => orderController.table_id === table_id)

        let total = 0

        orderControllers.forEach((orderController) => {
            let orderT = 0

            orderController.orders.forEach(order => {
                const addOnsTotal = order.add_ons.reduce((acc, curr) => acc + curr.price, 0)
                orderT += (order.price + addOnsTotal) * order.quantity
            })

            total += orderT
        })

        return total
    }

}));
