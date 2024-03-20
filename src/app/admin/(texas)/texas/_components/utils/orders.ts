import { IOrder, IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface"

export interface OrderFilterProps {
    status: OrderStatus[]
}

interface GetOrdersFromOrderControllersProps {
    filter: OrderFilterProps,
    orderControllers: IOrderController[]
}
export const getOrdersFromOrderControllers = ({filter, orderControllers }: GetOrdersFromOrderControllersProps) => {
    const { status } = filter
    let orders: IOrder[] = []

    orderControllers.forEach((orderController) => {
        orders = [...orders, ...orderController.orders]
    })

    if (status) {
        orders = orders.filter((order) => status.includes(order.status))
    }

    return orders
}