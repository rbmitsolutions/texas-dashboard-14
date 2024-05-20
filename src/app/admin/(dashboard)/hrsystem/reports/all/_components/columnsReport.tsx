"use client"
import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"
import { ArrowUpDown } from "lucide-react"

//components
import { Button } from "@/components/ui/button"

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"

//libs
import { IHaccpReports } from "@/common/types/company/haccpReports.interface"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { IToken } from "@/common/types/auth/auth.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import FileDownloadButton from "@/components/common/fileDownloadButton"


interface IColumsReports {
    user: IToken
    deleteHaccpReport: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    isDeleteLoading: boolean
}

export const columnsReports = ({
    user,
    deleteHaccpReport,
    isDeleteLoading
}: IColumsReports): ColumnDef<IHaccpReports>[] => {
    return [
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <div className='max-w-32'>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div>
                        <p>
                            {formatDate({
                                date: row.original.created_at,
                                f: "LLL dd, yy",
                            })}
                        </p>
                    </div>
                )
            },
            id: 'date'
        },
        {
            accessorKey: "title",
            id: 'title',
            header: ({ column }) => {
                return (
                    <div className='max-w-40'>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Title
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },

        },
        {
            accessorKey: "created_by",
            header: ({ column }) => {
                return (
                    <div className='max-w-44'>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Created By
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            id: 'created_by'
        },
        {
            accessorKey: 'description',
            header: () => {
                return (
                    <div className='w-80'>
                        Description
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className='w-full'>
                        <div className='text-sm'>{row.original.description}</div>
                    </div>
                )
            },
            id: 'description'
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return (
                    <div className='flex-container px-2'>
                        <FileDownloadButton
                            file_id={row.original.file_id}
                        />
                        <DeleteDialogButton
                            onDelete={() => deleteHaccpReport({
                                haccpReport: {
                                    id: row.original.id,
                                    file_id: row.original.file_id
                                }
                            })}
                            isDisabled={isDeleteLoading || user?.user_id !== row.original.created_by_id}
                            buttonProps={{
                                size: 'iconSm'
                            }}
                        />
                    </div>
                )
            }
        }
    ]
}
