"use client"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import Icon from "@/common/libs/lucida-icon"

//components
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IStockProducts } from "@/common/types/restaurant/stock.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"

export interface StockProductsColumnsTableProps {
}

export const StockProductsColumnsTable = ({
}: StockProductsColumnsTableProps): ColumnDef<IStockProducts>[] => {
    return [
        {
            accessorKey: "code",
            header: () => <div className="text-left">Code</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.code}
                    </div>
                )
            }
        },
        {
            accessorKey: "title",
            header: () => <div className="text-left">Name</div>,
            size: 300,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.title?.toLowerCase()}
                    </div>
                )
            }
        },
        {
            accessorKey: "orders",
            header: () => <div className="text-left">Orders</div>,
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.orders?.length} orders
                    </div>
                )
            }
        },
        {
            accessorKey: "total",
            header: () => <div className="text-left">Total</div>,
            size: 150,
            cell: ({ row }) => {
                const total: number = row?.original?.orders?.reduce((acc, order) => {
                    return acc + order.total
                }, 0)
                return (
                    <div className='capitalize'>
                        {total ? convertCentsToEuro(total) : 0}
                    </div>
                )
            }
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-left">Action</div>,
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex-container items-center gap-4'>
                        <LinkButton
                            href={RedirectTo.PRODUCT_PROFILE + `/${row?.original?.supplier_id}/${row?.original?.id}`}
                        />
                    </div>
                )
            }
        },

    ]

}