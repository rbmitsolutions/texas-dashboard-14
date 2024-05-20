import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_URL! as string, {
    path: '/socket.io',
    transports: ['websocket'],
    secure: true,
});


export enum SocketIoEvent {
    TABLE = "table",
    BOOKING = "booking",
    BOOKING_CONFIG = 'booking-config',
    ORDER = "order",
    REVIEWS = 'reviews',
    TABLE_PAYMENT = 'table-payment',
    GIFT_CARD_PAYMENT = 'giftcard-payment',
}

export enum SocketIoFrom {
    BOOKING = "booking",
    WAITER = "waiter",
    WAITER_TABLE = "waiter-table",
    RECEPTION = "reception",
    RECEPTION_TABLE = "reception-table",
    CHEFS = "chefs",
    PASS = "pass",
}

export type ISocketMessage = {
    event: SocketIoEvent[]
    message?: string;
};