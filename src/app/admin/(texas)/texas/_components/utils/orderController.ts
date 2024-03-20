import { IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface"

export interface OrderControllerFilterProps {
    table_id: string
    orders?: {
        status: OrderStatus[]
    }
}

interface GetFilteredOrderControllersProps {
    filter: OrderControllerFilterProps
    orderControllers: IOrderController[]
}

export const getFilteredOrderControllers = ({
    filter,
    orderControllers,
}: GetFilteredOrderControllersProps) => {
    const { table_id, orders } = filter

    if (table_id?.length > 0) {
        orderControllers = orderControllers.filter((orderController) => orderController.table_id === table_id)
    }

    if (orders) {
        orderControllers = orderControllers.filter((orderController) => {
            return orderController.orders.some((order) => orders.status.includes(order.status))
        })
    }

    return orderControllers
}