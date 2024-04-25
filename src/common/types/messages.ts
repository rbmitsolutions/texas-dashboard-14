import { RedirectTo } from "./routers/endPoints.types"

export enum ErrorMessages {
    TABLE_IS_CLOSED = 'Table is closed',
}

export enum NotificationType {
    LOW_STOCK = "low stock",
    REQUEST = "request",
    REVIEW = "review",
}

export enum NotificationRedirectTo {
    "low stock" = RedirectTo.ITEM_PROFILE,
    request = RedirectTo.REQUEST_PROFILE,
    review = RedirectTo.REVIEWS
}

export interface INotification {
    id: string

    type: NotificationType
    message: string

    key_id: string

    created_at: Date
    updated_at: Date
}