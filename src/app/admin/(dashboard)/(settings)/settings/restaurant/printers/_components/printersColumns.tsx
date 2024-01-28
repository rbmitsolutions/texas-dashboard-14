"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface PrintersColumnsTableProps {
    onDelete: (id: string) => void
}

export const PrintersColumnsTable = ({
    onDelete
}: PrintersColumnsTableProps): ColumnDef<IPrinters>[] => {
    return [
        {
            id: "title",
            accessorKey: "Title",
            size: 40,
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.title}</h2>
                )
            }
        },
        {
            id: "ip",
            accessorKey: "ip",
            size: 100,
        },
        {
            id: "description",
            accessorKey: "Description",
            size: 100,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <DeleteDialogButton
                            onDelete={() => onDelete(row?.original?.id)}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}