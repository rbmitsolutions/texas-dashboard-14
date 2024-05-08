export enum IFilesType {
    IMAGE = 'image',
    PDF = 'pdf',
}

export enum IFilesAs {
    AVATAR = 'avatar',
    DOCUMENT = 'document',
    CONTRACT = 'contract',
    CONTRACT_SIGNED = 'contract-signed',
    CONTRACT_FILED = 'contract-filed',
    CV = 'cv',
    REPORT = 'report',
    MENU = 'menu',
    STOCK_ORDER_CONTROLLER = 'stock-order-controller',
    USER_DOCUMENTS = 'user-docs',
    USER_PASSPORT = 'user-passport',
    USER_POA = 'user-poa',
    USER_PPS = 'user-pps',
}

export interface IFiles {
    id: string

    title: string
    description?: string

    public_id: string
    signature: string
    secure_url: string
    url: string

    as: IFilesAs
    type: IFilesType

    key: string // id of user / company / etc

    created_at: Date
    updated_at: Date
}