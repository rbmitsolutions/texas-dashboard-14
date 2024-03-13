import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { IOrder, OrderStatus } from "@/common/types/restaurant/order.interface";
import { ButtonProps } from "@/components/ui/button";

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
            return 'border-orange-400'
        case 'cancelled':
            return 'border-yellow-400'
        case 'returned':
            return 'border-red-400'
        case 'paid':
            return 'border-green-400'
        case 'delivered':
            return 'border-purple-400'
        default:
            return 'border-orange-400'
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
