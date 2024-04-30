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
            size: 80,
            cell: ({ row }) => {
                return formatDate({
                    date: row?.original?.date || row?.original?.created_at,
                    f: 'dd/MM/yyyy',
                    iso: false
                })
            }
        },

        {
            id: "method",
            header: () => <div className="text-left">Method</div>,
            size: 60,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.method || ''} </div>
            }
        },
        {
            id: "valid_by",
            size: 120,
            header: () => <div className="text-left">Valid By</div>,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.valid_by?.toLowerCase() || ''}</div>
            }
        },

        {
            id: "payee",
            size: 120,
            header: () => <div className="text-left">Payee</div>,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.payee?.toLowerCase() || ''}</div>
            }
        },
        {
            id: "type",
            header: () => <div className="text-left">Type</div>,
            size: 80,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.type || ''}</div>
            }
        },
        {
            id: "description",
            header: () => <div className="text-left">Description</div>,
            size: 250,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.type !== 'closed-table' && row?.original?.description || ''} </div>
            }
        },
        {
            id: "direction",
            accessorKey: "Direction",
            size: 60,
            cell: ({ row }) => {
                return <div className='capitalize'>{row?.original?.direction || ''} </div>
            }
        },
        {
            id: "total",
            header: () => <div className="text-left">Total</div>,
            size: 80,
            cell: ({ row }) => {
                return <div>{convertCentsToEuro(row?.original?.total || 0)}</div>
            }
        },
    ]
}