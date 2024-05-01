"use client"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IStockItemHistory } from "@/common/types/restaurant/stock.interface"
import ItemDescriptionDialog from "../../../../_components/itemDescriptionDialog"
import { RedirectTo } from "@/common/types/routers/endPoints.types"

export interface StockItemHistoryTableProps {
}

//todo: add the rest of the columns
export const StockItemHistoryTable = ({ }: StockItemHistoryTableProps): ColumnDef<IStockItemHistory>[] => {
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
            accessorKey: 'item',
            header: () => <div className="text-left">Item</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <ItemDescriptionDialog item={row?.original?.item} />
                )
            }
        },
        {
            accessorKey: 'menu',
            header: () => <div className="text-left">Menu Item</div>,
            size: 500,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.menu}
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
                    <div className='capitalize'>
                        {(row?.original?.quantity / row?.original?.item?.volume).toFixed(2)}
                    </div>
                )
            }
        },
        {
            accessorKey: 'actions',
            header: () => <div className="text-left">Actions</div>,
            size: 80,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        <LinkButton
                            href={RedirectTo.MENU_PROFILE + '/' + row?.original?.menu_id}
                            icon="ChefHat"
                        />
                    </div>
                )
            }
        },
    ]

}