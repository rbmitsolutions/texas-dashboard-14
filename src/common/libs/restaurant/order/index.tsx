//interfaces
import { IOrder, IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface";
import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { ButtonProps } from "@/components/ui/button";
import { ICreateNewOrder } from "@/store/restaurant/order";

export const scrollToOrder = (orderId: string): void => {
    const orderSummary = document.getElementById('order-summary-container')
    const order = document.getElementById(`order-${orderId}`)

    if (order && orderSummary) {
        orderSummary?.scrollTo({
            top: order?.offsetTop ? order?.offsetTop - order?.offsetHeight : 0,
            behavior: "smooth",
        });
    }
}

export const getOrderStatusBorderColor = (status: OrderStatus): string => {
    switch (status) {
        case 'ordered':
            return 'border-l-orange-400'
        case 'cancelled':
            return 'border-l-yellow-400'
        case 'returned':
            return 'border-l-red-400'
        case 'paid':
            return 'border-l-green-400'
        case 'delivered':
            return 'border-l-purple-400'
        default:
            return 'border-l-orange-400'
    }
}

export const getOrderStatusVariant = (status: OrderStatus): ButtonProps['variant'] => {
    switch (status) {
        case 'ordered':
            return 'orange'
        case 'cancelled':
            return 'yellow'
        case 'returned':
            return 'destructive'
        case 'paid':
            return 'green'
        case 'delivered':
            return 'purple'
        default:
            return 'default'
    }
}

interface IHasOrdersWithOrderedStatus {
    starters: boolean;
    maincourse: boolean;
    desserts: boolean;
    bar: boolean;
    sides: boolean;
    kidsmenu: boolean;
    hasfood: boolean;
    hasdrinks: boolean;
    hasdessert: boolean;
}

export const hasOrdersWithOrderedStatus = (orders: IOrder[], sections: IMenuSection[]): IHasOrdersWithOrderedStatus => {
    const ordersAlreadyOrdered = {
        hasdrinks: false,
        hasfood: false,
        hasdessert: false,
    } as IHasOrdersWithOrderedStatus;

    const menuTypeKeys: (keyof IHasOrdersWithOrderedStatus)[] = ['starters', 'maincourse', 'desserts', 'bar', 'sides', 'kidsmenu'];

    menuTypeKeys.forEach(key => {
        ordersAlreadyOrdered[key] = orders.some(
            o => sections?.some(menuType => menuType?.title?.replace(/\s+/g, '').toLowerCase() === key && menuType?.types?.find(i => i?.title === o?.mn_type) && o?.status === 'ordered')
        );
    });

    if (ordersAlreadyOrdered.maincourse || ordersAlreadyOrdered.kidsmenu || ordersAlreadyOrdered.sides || ordersAlreadyOrdered.starters) {
        ordersAlreadyOrdered.hasfood = true;
    }

    if (ordersAlreadyOrdered.bar) {
        ordersAlreadyOrdered.hasdrinks = true;
    }

    if (ordersAlreadyOrdered.desserts) {
        ordersAlreadyOrdered.hasdessert = true;
    }

    return ordersAlreadyOrdered;
};


export interface OrderFilterProps {
    status?: OrderStatus[]
    mn_type?: string;
    mn_section?: string;
}

interface GetOrdersProps {
    filter: OrderFilterProps,
    orderControllers: IOrderController[]
}

export const getOrders = ({ filter, orderControllers }: GetOrdersProps) => {
    const { status, mn_type, mn_section } = filter
    let orders: IOrder[] = []

    orderControllers.forEach((orderController) => {
        orders = [...orders, ...orderController.orders]
    })

    if (status) {
        orders = orders.filter((order) => status.includes(order.status))
    }

    if (mn_type) {
        orders = orders.filter((order) => order.mn_type === mn_type)
    }

    if (mn_section) {
        orders = orders.filter((order) => order.mn_section === mn_section)
    }

    return orders
}

export const getOrderTotal = (order: IOrder | ICreateNewOrder): number => {
    const addOnsTotal = order?.add_ons?.reduce((acc, curr) => acc + curr?.price, 0)
    const totalPaid = (order?.price + addOnsTotal) * (order?.paid || 0)
    return ((order?.price + addOnsTotal) * order?.quantity) - totalPaid
}