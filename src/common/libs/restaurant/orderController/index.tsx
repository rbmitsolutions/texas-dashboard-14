import { IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface"

export const orderControllersTotal = (orderController: IOrderController[]): number => {
    let total = 0

    orderController?.forEach((oc) => {
        let orderT = 0

        oc?.orders.forEach(order => {
            if (order?.status === OrderStatus.ORDERED || order?.status === OrderStatus.DELIVERED || order?.status === OrderStatus.PAID) {
                const addOnsTotal = order.add_ons.reduce((acc, curr) => acc + curr.price, 0)
                orderT += (order.price + addOnsTotal) * order.quantity
            }
        })

        total += orderT
    })

    return total
}

export interface OrderControllerFilterProps {
    orders?: {
        status?: OrderStatus[]
    }
}

interface FilteredOrderControllersProps {
    filter: OrderControllerFilterProps
    orderControllers: IOrderController[]
}

export const filteredOrderControllers = ({
    filter,
    orderControllers,
}: FilteredOrderControllersProps) => {
    const { orders } = filter

    if (orders?.status) {
        orderControllers = orderControllers.filter((orderController) => {
            return orderController.orders.some((order) => orders?.status?.includes(order.status))
        })
    }

    return orderControllers
}