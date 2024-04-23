'use client'

//components
import { StockItemColumnsTable } from "./_components/itemsColumns"
import { BasicTable } from "@/components/common/basicTable"
import NewItemDialog from "./_components/newItemDialog"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETStockDataHooks, usePOSTStockDataHooks } from "@/hooks/stock/stockDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

export default function Stock() {
    const { user } = useAuthHooks()
    const {
        stockAllItem: items,
        GETStockDataParams: params,
        setGETStockDataParams: setParams,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'ITEM',
        keepParmas: true,
        defaultParams: {
            item: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        products: '1',
                        extra_entries: '1',
                        category: '1',
                        sub_category: '1'
                    }
                }
            }
        }
    })

    const {
        stockAllCategory: categories,
        GETStockDataParams: categoriesParams,
        setGETStockDataParams: setCategoriesParams,
    } = useGETStockDataHooks({
        query: 'CATEGORY',
        defaultParams: {
            category: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        sub_categories: '1'
                    }
                }
            }
        }
    })

    const {
        createStockData: createItem
    } = usePOSTStockDataHooks({
        query: 'ITEM',
        toRefetch
    })

    const {
        createStockData: createEntry
    } = usePOSTStockDataHooks({
        query: 'EXTRA_ITEM_ENTRY',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Blocks',
                    title: 'Items'
                },
                pagination: {
                    onPageChange: (pagination) => setParams(prev => ({
                        item: {
                            all: {
                                ...prev?.item?.all,

                                pagination
                            }
                        }
                    })),
                    pagination: items?.pagination,
                    queryPagination: params?.supplier?.all?.pagination!,
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (search) => setParams(prev => ({
                        item: {
                            all: {
                                ...prev?.item?.all,
                                title: search
                            }
                        }
                    })),
                    value: params?.item?.all?.title || ''
                },
                toRight: (
                    <div >
                        <NewItemDialog
                            createItem={createItem}
                            categories={{
                                categories: categories?.data || [],
                                categoriesParams,
                                setCategoriesParams
                            }}
                        />
                    </div >
                ),
                className: 'grid grid-cols-[1fr,auto]'
            }}
        >
            <BasicTable
                columns={StockItemColumnsTable({
                    createEntry,
                    user
                })}
                data={items?.data || []}
            />
        </Wrap >
    )
}