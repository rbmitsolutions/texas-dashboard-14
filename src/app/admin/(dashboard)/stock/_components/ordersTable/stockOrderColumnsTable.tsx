"use client"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import FormDataDialog from "@/components/common/formDataDialog"
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IStockOrders } from "@/common/types/restaurant/stock.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import ItemDescriptionDialog from "../itemDescriptionDialog"

export interface stockOrderColumnsTableProps {
}

export const StockOrderColumnsTable = ({ }: stockOrderColumnsTableProps): ColumnDef<IStockOrders>[] => {
    return [
        {
            accessorKey: 'created_at',
            header: () => <div className="text-left">Date</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        {formatDate({
                            date: row?.original?.created_at,
                            f: 'dd/MM/yyyy'
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-left">Quantity</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        {row?.original?.product_quantity}
                    </div>
                )
            }
        },
        {
            accessorKey: "product",
            header: () => <div className="text-left">Product</div>,
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.product?.title}
                    </div>
                )
            }
        },
        {
            accessorKey: "item",
            header: () => <div className="text-left">Item</div>,
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        <ItemDescriptionDialog item={row?.original?.item} />
                    </div>
                )
            }
        },
        {
            accessorKey: 'delivery_date',
            header: () => <div className="text-left">Delivery Date</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        {row?.original?.delivery_date ? formatDate({
                            date: row?.original?.delivery_date,
                            f: 'dd/MM/yyyy'
                        }) : '-'}
                    </div>
                )
            }
        },
        {
            accessorKey: "deposit",
            header: () => <div className="text-left">Deposit</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {convertCentsToEuro(row?.original?.deposit)}
                    </div>
                )
            }
        },
        {
            accessorKey: "vat",
            header: () => <div className="text-left">Vat</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.vat}%
                    </div>
                )
            }
        },
        {
            accessorKey: "price",
            header: () => <div className="text-left">Price (unit)</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {convertCentsToEuro(row?.original?.one_product_price)}
                    </div>
                )
            }
        },
        {
            accessorKey: "total",
            header: () => <div className="text-left">Total</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {convertCentsToEuro(row?.original?.total)}
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
                        <FormDataDialog
                            formDataId={row?.original?.haccp_data_id}
                        />
                        <LinkButton
                            href={RedirectTo.STOCK_ORDER_CONTROLLER_PROFILE + `/${row?.original?.order_controller_id}`}
                        />
                    </div>
                )
            }
        },
    ]

}