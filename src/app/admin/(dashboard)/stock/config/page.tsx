'use client'

//components
import { StockCategoryColumnsTable } from "./_components/categoryColumnsTable"
import { BasicTable } from "@/components/common/basicTable"
import NewSubCategory from "./_components/newSubCategory"
import NewCategory from "./_components/newCategoryForm"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETEStockDataHooks, useGETStockDataHooks, usePOSTStockDataHooks } from "@/hooks/stock/stockDataHooks"

export default function Config() {
    const {
        stockAllCategory: categories,
        GETStockDataParams: params,
        setGETStockDataParams: setParams,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'CATEGORY',
        keepParmas: true,
        defaultParams: {
            category: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        sub_categories: '1',
                    }
                }
            }
        }
    })

    const {
        createStockData: createCategory
    } = usePOSTStockDataHooks({
        query: 'CATEGORY',
        toRefetch
    })

    const {
        createStockData: createSubCategory
    } = usePOSTStockDataHooks({
        query: 'SUB_CATEGORY',
        toRefetch
    })

    const {
        deleteStockData: deleteSubCategory
    } = useDELETEStockDataHooks({
        query: 'SUB_CATEGORY',
        toRefetch
    })

    const {
        deleteStockData: deleteCategory
    } = useDELETEStockDataHooks({
        query: 'CATEGORY',
        toRefetch
    })


    return (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr,400px]'>
            <Wrap
                header={{
                    title: {
                        icon: 'Settings',
                        title: 'Categories'
                    },
                    pagination: {
                        onPageChange: (pagination) => setParams(prev => ({
                            category: {
                                all: {
                                    ...prev?.category?.all,
                                    pagination
                                }
                            }
                        })),
                        pagination: categories?.pagination,
                        queryPagination: params?.category?.all?.pagination!,
                    }
                }}
            >
                <BasicTable
                    columns={StockCategoryColumnsTable({
                        deleteCategory,
                        deleteSubCategory
                    })}
                    data={categories?.data || []}
                />
            </Wrap>
            <div className='flex-col-container'>
                <NewCategory createCategory={createCategory} />
                <NewSubCategory
                    createSubCategory={createSubCategory}
                    categories={categories?.data || []}
                />
            </div>
        </div>
    )
}