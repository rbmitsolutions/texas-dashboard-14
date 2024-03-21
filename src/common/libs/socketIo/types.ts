export enum SocketIoEvent {
    TABLE = "table",
    BOOKING = "booking",
    BOOKING_CONFIG = 'booking-config',
    ORDER = "order",
    REVIEWS = 'reviews',
    TABLE_PAYMENT = 'table-payment',
    GIFT_CARD_PAYMENT = 'giftcard-payment',
}

export type ISocketMessage = {
    event: SocketIoEvent;
    message?: string;
};