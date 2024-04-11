"use client"

import { ColumnDef } from "@tanstack/react-table"

//libs
import { getOrderStatusVariant } from "@/common/libs/restaurant/order"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import { Button } from "@/components/ui/button"

//interface
import { IOrder } from "@/common/types/restaurant/order.interface"

interface OrdersColumnsTableProps {
}

export const OrdersColumnsTable = ({ }: OrdersColumnsTableProps): ColumnDef<IOrder>[] => {
    return [
        {
            id: "mn_type",
            accessorKey: "Menu Type",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.mn_type
            }
        },
        {
            id: "menu",
            accessorKey: "Title",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.menu
            }
        },
        {
            id: "menu_short_title",
            accessorKey: "Short Title",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.menu_short_title
            }
        },
        {
            id: "quantity",
            accessorKey: "Quantity",
            size: 40,
            cell: ({ row }) => {
                return row?.original?.quantity
            }
        },
        {
            id: "mn_section",
            accessorKey: "Menu Section",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.mn_section
            }
        },
        {
            id: "status",
            accessorKey: "Status",
            size: 80,
            cell: ({ row }) => {
                return (
                    <Button
                        variant={getOrderStatusVariant(row?.original?.status)}
                        size='sm'
                        className='!p-1'
                    >
                        {row?.original?.status}
                    </Button>
                )
            },
        },
        {
            id: "created_at",
            accessorKey: "Date / Time",
            size: 140,
            cell: ({ row }) => {
                return formatDate({
                    date: row?.original?.created_at,
                    f: 'dd/MM/yyyy HH:mm',
                    iso: false
                })
            }
        },
        {
            id: "add_ons",
            accessorKey: "Prerequisite",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.add_ons?.length
            },

        },
        {
            id: "total",
            accessorKey: "Total",
            size: 100,
            cell: ({ row }) => {
                return convertCentsToEuro(row?.original?.price * row?.original?.quantity)
            },
        },
    ]
}