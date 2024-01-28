"use client"

import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ColumnDef } from "@tanstack/react-table"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface MenuSectionColumnsTableProps {
    onDelete: (id: string) => void
}

export const menuSectionColumnsTable = ({
    onDelete
}: MenuSectionColumnsTableProps): ColumnDef<IMenuSection>[] => {
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
            id: "bg_color",
            accessorKey: "Color",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex-container-center'>
                        <div className='w-10 h-6' style={{ backgroundColor: row?.original?.bg_color }} />
                    </div>
                )
            }
        },
        {
            id: "types",
            accessorKey: "Types Linked",
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.types?.length} linked</h2>
                )
            },
            size: 40,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <DeleteDialogButton
                            onDelete={() => onDelete(row?.original?.id)}
                            isDisabled={row?.original?.types?.length > 0}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}