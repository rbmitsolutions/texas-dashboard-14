"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { IDepartments } from "@/common/types/company/departaments.interface"
import { UseMutateFunction } from "react-query"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { Badge } from "@/components/ui/badge"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface DepartamentsColumnsTableProps {
    onDelete: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export const departamentsColumnsTable = ({
    onDelete
}: DepartamentsColumnsTableProps): ColumnDef<IDepartments>[] => {
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
            id: "roles",
            accessorKey: "Roles",
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='flex-container flex-wrap capitalize'>
                        {row?.original?.roles?.map(role => {
                            return <Badge key={role.id} title={role.title}>{role.title}</Badge>
                        })}
                    </div>
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
                            onDelete={async () => await onDelete({
                                departament: {
                                    id: row?.original?.id
                                }
                            })}
                            isDisabled={row?.original?.roles?.length > 0}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}