"use client"
import { UseMutateFunction } from "react-query"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface"
import { IStockItem, IStockOrders } from "@/common/types/restaurant/stock.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { IToken } from "@/common/types/auth/auth.interface"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import Icon from "@/common/libs/lucida-icon"
import { cn } from "@/common/libs/shadcn/utils"

export interface StockOrderAuthorizedColumnsProps {
}

export const StockOrderAuthorizedColumns = ({ }: StockOrderAuthorizedColumnsProps): ColumnDef<IStockOrders>[] => {
    return [
        // {
        //     accessorKey: "title",
        //     header: () => <div className="text-left">Title</div>,
        //     size: 200,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.title?.toLowerCase()}
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "category",
        //     header: () => <div className="text-left">Category</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.category?.title}
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "sub_category",
        //     header: () => <div className="text-left">Sub Categ.</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.sub_category?.title}
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "stock",
        //     header: () => <div className="text-left">Stock</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <HoverCard>
        //                 <HoverCardTrigger>
        //                     <strong className={cn('flex-container items-center gap-1', row?.original?.stock < row?.original?.min_stock && 'text-red-500')}>
        //                         {row?.original?.stock > 0 ? (row?.original?.stock / row?.original?.volume).toFixed(0) : row?.original?.stock}
        //                         <Icon name='Info' />
        //                     </strong>
        //                 </HoverCardTrigger>
        //                 <HoverCardContent>
        //                     {row?.original?.stock > 0 ?
        //                         <div>
        //                             {row?.original?.stock / row?.original?.volume} {row.original?.title} or {row?.original?.stock} {row?.original?.unit}
        //                         </div>
        //                         : 'Out of Stock'}
        //                 </HoverCardContent>
        //             </HoverCard>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "min_stock",
        //     header: () => <div className="text-left">Min. Stock</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.min_stock}
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "max_stock",
        //     header: () => <div className="text-left">Max. Stock</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.max_stock}
        //             </div>
        //         )
        //     }
        // },

        // {
        //     accessorKey: "last_order_date",
        //     header: () => <div className="text-left">Last Order / Date</div>,
        //     size: 150,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.last_order_date ?
        //                     formatDate({
        //                         date: row?.original?.last_order_date,
        //                         f: 'dd/MM/yyyy'
        //                     }) : '-'
        //                 }
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "last_order_one_vol_price",
        //     header: () => <div className="text-left">Last Order / Price</div>,
        //     size: 150,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.last_order_one_vol_price ?
        //                     convertCentsToEuro(row?.original?.last_order_one_vol_price) : '-'
        //                 }
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "products",
        //     header: () => <div className="text-left">Products</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.products?.length} Produts
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "extra_entries",
        //     header: () => <div className="text-left">Extra Entries</div>,
        //     size: 100,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='capitalize'>
        //                 {row?.original?.extra_entries?.length} entries
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: "actions",
        //     header: () => <div className="text-left">Action</div>,
        //     size: 40,
        //     cell: ({ row }) => {
        //         return (
        //             <div className='flex-container items-center gap-4'>
        //                 <NewItemEntryDialog
        //                     item={row?.original}
        //                     createEntry={createEntry}
        //                     user={user}
        //                 />
        //                 <LinkButton
        //                     href={RedirectTo.ITEM_PROFILE + `/${row?.original?.id}`}
        //                 />
        //             </div>
        //         )
        //     }
        // },

    ]

}