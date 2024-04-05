"use client"
import { ColumnDef } from "@tanstack/react-table"

//libs
import { orderControllersTotal } from "@/common/libs/restaurant/orderController"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//interface
import { IOrderController } from "@/common/types/restaurant/order.interface"

interface OrderControllerColumnsTableProps {
}

export const OrderControllerColumnsTable = ({
}: OrderControllerColumnsTableProps): ColumnDef<IOrderController>[] => {
    return [
        // {
        //     id: "number",
        //     accessorKey: "Number",
        //     size: 40,
        //     cell: ({ row }) => {
        //         return row?.original?.number
        //     }
        // },
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
            id: "pass",
            accessorKey: "Pass",
            size: 40,
            cell: ({ row }) => {
                return row?.original?.pass
            }
        },
        {
            id: "waiter",
            accessorKey: "Waiter",
            size: 400,
            cell: ({ row }) => {
                return row?.original?.waiter
            }
        },
        {
            id: "orders",
            accessorKey: "Items",
            size: 40,
            cell: ({ row }) => {
                return row?.original?.orders?.length
            }
        },
        {
            id: "total",
            accessorKey: "total",
            size: 40,
            cell: ({ row }) => {
                return convertCentsToEuro(orderControllersTotal([row?.original] || 0))
            }
        },
    ]
}