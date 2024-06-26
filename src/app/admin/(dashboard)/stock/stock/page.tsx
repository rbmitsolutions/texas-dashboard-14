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

    const categoriesOptions = categories?.data?.map(category => {
        return {
            label: category?.title,
            value: category?.id
        }
    }) || []

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
                    queryPagination: params?.item?.all?.pagination!,
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
                optionsPopover: {
                    options: [
                        {
                            label: 'Category',
                            value: params?.item?.all?.category?.id[0] || '',
                            placeholder: 'Category',
                            onChange: (e: string) => setParams(prev => ({
                                item: {
                                    all: {
                                        ...prev?.item?.all,
                                        pagination: {
                                            take: 20,
                                            skip: 0
                                        },
                                        category: {
                                            id: e === 'all' ? [] : [e]
                                        }
                                    }
                                }
                            })),
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...categoriesOptions
                            ]
                        }
                    ]
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
                className: 'grid grid-cols-[1fr,auto,auto] gap-4 items-center',
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