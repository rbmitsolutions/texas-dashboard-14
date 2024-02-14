"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IAuthorizedDevices } from "@/common/types/restaurant/authorizedDevices.interface"
import { UseMutateFunction } from "react-query"
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

interface AuthDevicesColumnsTableProps {
    deleteAuthorizedDevices: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
}

export const authDevicesColumnsTable = ({
    deleteAuthorizedDevices
}: AuthDevicesColumnsTableProps): ColumnDef<IAuthorizedDevices>[] => {
    return [
        {
            id: "title",
            accessorKey: "Title",
            size: 400,
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.description}</h2>
                )
            }
        },
        {
            id: "ip",
            accessorKey: "Ip",
            size: 100,
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.ip}</h2>
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
                            onDelete={async () => await deleteAuthorizedDevices({
                                authorizedDevice: {
                                    id: row?.original?.id
                                }
                            })}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}