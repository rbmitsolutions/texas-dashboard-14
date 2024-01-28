"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { IMenuType } from "@/common/types/restaurant/menu.interface"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface MenuTypesColumnsTableProps {
    onDelete: (id: string) => void
}

export const menuTypesColumnsTable = ({
    onDelete
}: MenuTypesColumnsTableProps): ColumnDef<IMenuType>[] => {
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
            id: "menu",
            accessorKey: "Menus Linked",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex-container-center'>
                        <h2>{row?.original?.menu?.length} linked</h2>
                    </div>
                )
            }
        },
        {
            id: "section",
            accessorKey: "Section",
            size: 40,
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.section?.title}</h2>
                )
            }
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <DeleteDialogButton
                            onDelete={() => onDelete(row?.original?.id)}
                            isDisabled={row?.original?.menu?.length > 0}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}