export type IFilesType = "image" | 'pdf'

export interface IFiles {
    id: string

    title: string
    description?: string

    public_id: string
    signature: string
    secure_url: string
    url: string
    type: IFilesType

    key: string // id of user / company / etc

    created_at: Date
    updated_at: Date
}