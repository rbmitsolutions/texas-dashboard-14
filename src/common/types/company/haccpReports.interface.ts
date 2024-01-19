export interface IHaccpReports {
    id: string

    title: string
    description?: string

    created_by: string
    created_by_id: string

    public_id: string
    signature: string
    secure_url: string
    url: string

    created_at: Date
    updated_at: Date
}