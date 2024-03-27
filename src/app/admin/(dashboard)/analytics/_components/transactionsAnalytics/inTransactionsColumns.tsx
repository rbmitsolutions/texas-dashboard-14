"use client"

import { ColumnDef } from "@tanstack/react-table"

//interface
import { ITransactions } from "@/common/types/company/transactions.interface"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import InfoBadge from "@/components/common/infoBadge"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

interface InTransactionsColumnsTableProps {
    showDescription?: boolean
}

export const InTransactionsColumnsTable = ({
    showDescription = false
}: InTransactionsColumnsTableProps): ColumnDef<ITransactions>[] => {
    return [
        {
            id: "created_at",
            accessorKey: "Date / Time",
            size: 40,
            cell: ({ row }) => {
                return formatDate({
                    date: row?.original?.created_at,
                    f: 'dd/MM/yyyy HH:mm',
                    iso: false
                })
            }
        },
        {
            id: "method",
            accessorKey: "Method",
            size: 40,
            cell: ({ row }) => {
                return row?.original?.method
            }
        },
        {
            id: "type",
            accessorKey: "type",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.type
            }
        },
        {
            id: "direction",
            accessorKey: "Direction",
            size: 40,
            cell: ({ row }) => {
                return row?.original?.direction
            }
        },
        {
            id: "valid_by",
            accessorKey: "Valid By",
            size: 100,
            cell: ({ row }) => {
                return (
                    <h2>{row?.original?.valid_by}</h2>
                )
            }
        },
        {
            id: "status",
            accessorKey: "Status",
            size: 80,
            cell: ({ row }) => {
                return (
                    <InfoBadge
                        status={row?.original?.status}
                    />
                )
            },

        },
        {
            id: "description",
            accessorKey: "Description",
            size: 300,
            cell: ({ row }) => {
                return showDescription ? row?.original?.description : null
            },

        },
        {
            id: "total",
            accessorKey: "Total",
            size: 100,
            cell: ({ row }) => {
                return convertCentsToEuro(row?.original?.total)
            },
        },
    ]
}