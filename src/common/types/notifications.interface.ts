import { RedirectTo } from "./routers/endPoints.types"

export enum ErrorMessages {
    TABLE_IS_CLOSED = 'Table is closed',
}

export enum NotificationType {
    LOW_STOCK = "low stock",
    REQUEST = "request",
    REVIEW = "review",
    GIFTCARD = "giftcard",
    SMS_BALANCE = "sms balance",
    CONTRACT_SIGNED = "contract signed",
    JOB_APPLICATION = "job application",
    USER_FILE_UPLOADED = "user file uploaded",
}

export enum NotificationRedirectTo {
    "low stock" = RedirectTo.ITEM_PROFILE,
    request = RedirectTo.REQUEST_PROFILE,
    review = RedirectTo.REVIEWS,
    giftcard = RedirectTo.GIFTCARD_PAGE,
    'sms balance' = RedirectTo.SMS_CONFIG_PAGE,
    'contract signed' = RedirectTo.USER_PROFILE,
    'job application' = RedirectTo.JOB_APPLICATION,
    "user file uploaded" = RedirectTo.USER_PROFILE,
}

export interface INotification {
    id: string

    type: NotificationType
    message: string

    key_id: string

    created_at: Date
    updated_at: Date
}