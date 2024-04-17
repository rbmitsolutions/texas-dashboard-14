"use client"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import Icon from "@/common/libs/lucida-icon"

//components
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IStockSuppliers } from "@/common/types/restaurant/stock.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import AutoOrderSupplier from "./autoOrderSupplier"

export interface StockSuppliersColumnsTableProps {

}

export const StockSuppliersColumnsTable = ({ }: StockSuppliersColumnsTableProps): ColumnDef<IStockSuppliers>[] => {
    return [
        {
            accessorKey: "title",
            header: () => <div className="text-left">Name</div>,
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.title?.toLowerCase()}
                    </div>
                )
            }
        },
        {
            accessorKey: "address",
            header: () => <div className="text-left">Address</div>,
            size: 400,
            cell: ({ row }) => {
                return (
                    <div>
                        {row?.original?.address}
                    </div>
                )
            }
        },
        {
            accessorKey: "Auto Order",
            header: () => <div className="text-left">Auto Order</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        <Icon name={row.original.auto_order ? 'Check' : 'X'} className={row.original.auto_order ? 'text-green-500' : 'text-red-500'} />
                    </div>
                )
            }
        },
        {
            accessorKey: "categories",
            header: () => <div className="text-left">Categories</div>,
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className='flex flex-wrap gap-2'>
                        {row?.original?.categories?.map((category, index) => { return <span key={index}>{category?.title}</span> })}
                    </div>
                )
            }
        },
        {
            accessorKey: "orders_controller",
            header: () => <div className="text-left">Orders</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        {row?.original?.orders_controller?.length} Orders
                    </div>
                )
            }
        },
        {
            accessorKey: "products",
            header: () => <div className="text-left">Products</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        {row?.original?.products?.length} Products
                    </div>
                )
            }
        },
        {
            accessorKey: "spent",
            header: () => <div className="text-left">Total Spent</div>,
            size: 200,
            cell: ({ row }) => {
                return (
                    <div>
                        {convertCentsToEuro(row?.original?.spent || 0)}
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
                        {/* {onDelete?.isUserAuthorized &&
                            <DeleteDialogButton
                                onDelete={() => onDelete.action({
                                    finishedTable: {
                                        id: row?.original?.id
                                    }
                                })}
                                isDisabled={true}
                            />
                        } */}
                        <LinkButton
                            href={RedirectTo.SUPPLIER_PROFILE + `/${row?.original?.id}`}
                        />
                    </div>
                )
            }
        },

    ]

}