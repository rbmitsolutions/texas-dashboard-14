"use client"
import { UseMutateFunction } from "react-query"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"
import Icon from "@/common/libs/lucida-icon"

//components
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IStockOrdersController } from "@/common/types/restaurant/stock.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"

export interface StockOrderControllerColumnsProps {
}

export const StockOrderControllerColumns = ({ }: StockOrderControllerColumnsProps): ColumnDef<IStockOrdersController>[] => {
    return [
        {
            accessorKey: "supplier",
            header: () => <div className="text-left">Supplier</div>,
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.supplier?.title?.toLowerCase()}
                    </div>
                )
            }
        },
        {
            accessorKey: "paid",
            header: () => <div className="text-left">Paid</div>,
            size: 80,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        <Icon
                            name={row?.original?.paid ? 'Check' : 'X'}
                            className={cn(row?.original?.paid ? 'text-green-500' : 'text-red-500')}
                        />
                    </div>
                )
            }
        },
        {
            accessorKey: "orders",
            header: () => <div className="text-left">Orders</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <strong className='flex-container gap-1'>
                        {row?.original?.orders?.length} Orders
                    </strong>
                )
            }
        },
        {
            accessorKey: "total",
            header: () => <div className="text-left">Total</div>,
            size: 100,
            cell: ({ row }) => {
                const hasOrderNotDelivered = row?.original?.orders?.some(order => !order?.delivery_date)
                return (
                    <div>
                        {hasOrderNotDelivered ? 'Not Delivered' : convertCentsToEuro(row?.original?.total)}
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
                        {/* <NewItemEntryDialog
                            item={row?.original}
                            createEntry={createEntry}
                            user={user}
                        /> */}
                        <LinkButton
                            className="bg-orange-400 dark:bg-orange-500 hover:bg-orange-500 dark:hover:bg-orange-600"
                            icon="Building2"
                            href={RedirectTo.SUPPLIER_PROFILE + `/${row?.original?.supplier_id}`}
                        />
                        <LinkButton
                            href={RedirectTo.STOCK_ORDER_CONTROLLER_PROFILE + `/${row?.original?.id}`}
                        />
                    </div>
                )
            }
        },

    ]

}