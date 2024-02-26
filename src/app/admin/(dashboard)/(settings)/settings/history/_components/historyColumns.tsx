"use client"

//components
import { ColumnDef } from "@tanstack/react-table"

//interfaces
import { IHistory } from "@/common/types/auth/auth.interface"

export const historyColumnsTable = (): ColumnDef<IHistory>[] => {
    return [
        {
            id: "type",
            accessorKey: "Type",
            size: 140,
            cell: ({ row }) => {
                return (
                    <h2 className='capitalize'>{row?.original?.type}</h2>
                )
            }
        },
        {
            id: "by",
            accessorKey: "By",
            size: 140,
            cell: ({ row }) => {
                return (
                    <h2 className='capitalize'>{row?.original?.by}</h2>
                )
            }
        },
        {
            id: "description",
            accessorKey: "Description",
            size: 500,
            cell: ({ row }) => {
                return (
                    <h2 className='capitalize'>{row?.original?.description}</h2>
                )
            }
        },
    ]
}