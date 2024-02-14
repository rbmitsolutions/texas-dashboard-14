"use client"
import { UseMutateFunction } from "react-query"

//components
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

//interfaces
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IDuties } from "@/common/types/company/companyDetails.interface"

interface DutiesColumnsTableProps {
    onDelete: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export const dutiesColumnsTable = ({
    onDelete
}: DutiesColumnsTableProps): ColumnDef<IDuties>[] => {
    return [
        {
            id: "title",
            accessorKey: "Title",
            size: 80,
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.title}</h2>
                )
            }
        },
        {
            id: "departament",
            accessorKey: "Departament",
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='flex-container flex-wrap capitalize'>
                        <Badge title={row?.original?.departament?.title}>{row?.original?.departament?.title}</Badge>
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
                                duty: {
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