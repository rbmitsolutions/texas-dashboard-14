"use client"

import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { ColumnDef } from "@tanstack/react-table"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//interface
import { ITransactions } from "@/common/types/company/transactions.interface"

interface TransactionsColumnsTableProps {
}

export const TransactionsColumnsTable = ({ }: TransactionsColumnsTableProps): ColumnDef<ITransactions>[] => {
    return [
        {
            id: "date",
            accessorKey: "Date",
            size: 120,
            cell: ({ row }) => {
                return formatDate({
                    date: row?.original?.date || row?.original?.created_at,
                    f: 'dd/MM/yyyy',
                    iso: false
                })
            }
        },
        {
            id: "description",
            accessorKey: "description",
            size: 250,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.description || ''} </div>
            }
        },
        {
            id: "type",
            accessorKey: "type",
            size: 80,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.type || ''}</div>
            }
        },
        {
            id: "valid_by",
            accessorKey: "valid_by",
            size: 120,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.valid_by?.toLowerCase() || ''}</div>
            }
        },
        {
            id: "total",
            accessorKey: "total",
            size: 80,
            cell: ({ row }) => {
                return <div>{convertCentsToEuro(row?.original?.total || 0)}</div>
            }
        },
    ]
}