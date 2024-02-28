"use client"
import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"
import Icon from "@/common/libs/lucida-icon"
import { ArrowUpDown } from "lucide-react"
import toast from "react-hot-toast"

//components
import { Button } from "@/components/ui/button"

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"

//libs
import { IHaccpReports } from "@/common/types/company/haccpReports.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { IFiles } from "@/common/types/company/files.interface"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { IToken } from "@/common/types/auth/auth.interface"
import { api } from "@/common/libs/axios/api"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

const onDownload = async (file_id: string) => {
    try {
        const { data } = await api.get<IFiles>(EndPointsTypes.COMPANY_FILES_ENDPOINT, {
            params: {
                files: {
                    byId: {
                        id: file_id
                    }
                }
            }
        })

        const link = document.createElement('a')
        link.href = data.url
        link.download = data.title
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)


    } catch (err) {
        toast.error('File not found!')
    }
};


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
                        <DeleteDialogButton
                            onDelete={() => deleteHaccpReport({
                                haccpReport: {
                                    id: row.original.id,
                                    file_id: row.original.file_id
                                }
                            })}
                            isDisabled={isDeleteLoading || user?.user_id !== row.original.created_by_id}
                            buttonProps={{
                                size:'iconSm'
                            }}
                        />
                        <Button
                            size='iconSm'
                            onClick={() => onDownload(row.original.file_id)}

                        >
                            <Icon name='FileText' size={18} />
                        </Button>
                    </div>
                )
            }
        }
    ]
}
