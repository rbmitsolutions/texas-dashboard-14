"use client"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import FormDataDialog from "@/components/common/formDataDialog"
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IStockExtraItemEntry } from "@/common/types/restaurant/stock.interface"

export interface ExtraItemEntriesTableProps {
}

//todo: add the rest of the columns
export const ExtraItemEntriesTable = ({ }: ExtraItemEntriesTableProps): ColumnDef<IStockExtraItemEntry>[] => {
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
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.item?.title.toLowerCase()}
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
                        {row?.original?.quantity / row?.original?.item?.volume}
                    </div>
                )
            }
        },
        {
            accessorKey: 'old_stock',
            header: () => <div className="text-left">Old Stock</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.old_stock / row?.original?.item?.volume}
                    </div>
                )
            }
        },
        {
            accessorKey: 'new_stock',
            header: () => <div className="text-left">Stock After Entry</div>,
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.new_stock / row?.original?.item?.volume}
                    </div>
                )
            }
        },
        {
            accessorKey: 'entry_by',
            header: () => <div className="text-left">Entry By</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.entry_by}
                    </div>
                )
            }
        },
        {
            accessorKey: 'description',
            header: () => <div className="text-left">Description</div>,
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.description}
                    </div>
                )
            }
        },
    ]

}