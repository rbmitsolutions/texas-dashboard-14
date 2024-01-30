"use client"

import { IMenuAddOns } from "@/common/types/restaurant/menu.interface"
import { ColumnDef } from "@tanstack/react-table"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"
import { Switch } from "@/components/ui/switch"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface MenuAddOnsColumnsTableProps {
    onDelete: (id: string) => void
    setToEdit: (data: IMenuAddOns) => void
}

export const menuAddOnsColumnsTable = ({
    onDelete,
    setToEdit
}: MenuAddOnsColumnsTableProps): ColumnDef<IMenuAddOns>[] => {
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
            id: "flag",
            accessorKey: "Flag",

            size: 40,
        },
        {
            id: "options",
            accessorKey: "Options",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex-container-center'>
                        <h2>{row?.original?.options?.length} Options</h2>
                    </div>
                )
            }
        },
        {
            id: "manadatory",
            accessorKey: "Manadatory",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <Switch
                            disabled
                            checked={row?.original?.is_mandatory}
                        />
                    </div>
                )
            },
        },
        {
            id: "Multiple Chouse",
            accessorKey: "Multiple",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <Switch
                            disabled
                            checked={row?.original?.multiple}
                        />
                    </div>
                )
            },
        },
        {
            id: "min",
            accessorKey: "Min",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <h2>{row?.original?.multiple ? row?.original?.min : 1}</h2>
                    </div>
                )
            },
        },
        {
            id: "max",
            accessorKey: "Max",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <h2>{row?.original?.multiple ? row?.original?.max === 999 ? 'All' : row?.original?.max : '-'}</h2>
                    </div>
                )
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <Button
                            size='iconSm'
                            variant='orange'
                            onClick={() => setToEdit(row?.original)}
                        >
                            <Icon name='Pencil' size={14} />
                        </Button>
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
