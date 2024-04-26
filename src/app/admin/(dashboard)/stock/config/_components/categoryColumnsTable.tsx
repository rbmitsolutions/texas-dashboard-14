"use client"
import { UseMutateFunction } from "react-query"

//components
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { IDELETEStockDataBody } from "@/hooks/stock/IDeleteStockDataHooks.interface"
import { IStockCategories } from "@/common/types/restaurant/stock.interface"

export interface StockCategoryColumnsTableProps {
    deleteSubCategory: UseMutateFunction<void, any, IDELETEStockDataBody, unknown>
    deleteCategory: UseMutateFunction<void, any, IDELETEStockDataBody, unknown>
}

export const StockCategoryColumnsTable = ({ deleteCategory, deleteSubCategory }: StockCategoryColumnsTableProps): ColumnDef<IStockCategories>[] => {
    return [
        {
            accessorKey: "title",
            header: () => <div className="text-left">Title</div>,
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
            accessorKey: "sub_categories",
            header: () => <div className="text-left">Sub Categories</div>,
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center flex-wrap gap-4'>
                        {row?.original?.sub_categories?.map(sub => {
                            return (
                                <DeleteDialogButton
                                    key={sub?.id}
                                    onDelete={async () => await deleteSubCategory({
                                        sub_category: {
                                            id: sub?.id
                                        }
                                    })}
                                >
                                    <div
                                        className='bg-background-soft p-1 rounded-lg cursor-pointer hover:bg-red-300 dark:hover:bg-red-800'
                                    >

                                        {sub?.title}
                                    </div>
                                </DeleteDialogButton>

                            )
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return (
                    <div className='flex-container px-2'>
                        <DeleteDialogButton
                            onDelete={async () => await deleteCategory({
                                category: {
                                    id: row?.original?.id
                                }
                            })}
                            isDisabled={row?.original?.sub_categories?.length > 0}
                            buttonProps={{
                                size: 'iconSm'
                            }}
                        />
                    </div>
                )
            }
        }
    ]

}