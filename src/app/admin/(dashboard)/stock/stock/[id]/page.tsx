'use client'

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import ItemExtraEntreiesTable from "../../_components/itemExtraEntries/itemExtraEntriesTable"
import OrdersTable from "../../_components/ordersTable/ordersTable"
import ItemHistoryTable from "./_components/stockHistoryTable"
import NewItemDialog from "../_components/newItemDialog"
import ItemAnalytics from "./_components/itemAnalytics"
import InfoBox from "@/components/common/infoBox"

//hooks
import { useGETStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

export default function Item({ params }: { params: { id: string } }) {
    const {
        stockItem: item,
        refetchStockData: toRefetch,
    } = useGETStockDataHooks({
        query: 'ITEM',
        defaultParams: {
            item: {
                byId: {
                    id: params.id,
                    include: {
                        category: '1',
                        sub_category: '1',
                    }
                },
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        stockAllOrder: orders,
        GETStockDataParams: orderParams,
        setGETStockDataParams: setOrderParams
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                all: {
                    item: {
                        id: [params.id]
                    },
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        item: '1',
                        product: '1',
                    }
                }

            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        stockAllCategory: categories,
        GETStockDataParams: categoriesParams,
        setGETStockDataParams: setCategoriesParams
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
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        stockAllExtraItemEntry: extraEntries,
        GETStockDataParams: extraEntriesParams,
        setGETStockDataParams: setExtraEntriesParams
    } = useGETStockDataHooks({
        query: 'EXTRA_ITEM_ENTRY',
        defaultParams: {
            extra_item_entry: {
                all: {
                    item_id: {
                        in: [params?.id]
                    },
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        item: '1'
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params?.id
        }
    })

    const {
        stockAllItemHistory: itemHistory,
        GETStockDataParams: itemHistoryParams,
        setGETStockDataParams: setItemHistoryParams
    } = useGETStockDataHooks({
        query: 'ITEM_HISTORY',
        defaultParams: {
            item_history: {
                all: {
                    item_id: [params?.id],
                    pagination: {
                        skip: 0,
                        take: 10
                    },
                    include: {
                        item: '1',
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params?.id
        }
    })


    const {
        updateStockData: updateItem
    } = usePUTStockDataHooks({
        query: 'ITEM',
        toRefetch
    })

    return (
        <div>

            <div className=''>
                <div className='flex-col-container justify-center items-center gap-0 py-8'>
                    <h1 className='text-xl font-bold'>{item?.title}</h1>
                    <small>{item?.category?.title} / <span>{item?.sub_category?.title}</span></small>
                    <small>{item?.volume} {item?.unit}</small>
                </div>
                <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full'>
                    <InfoBox
                        icon={{
                            name: 'SquareStack',
                            className: item?.stock < (item?.min_stock * item?.volume) ? 'text-red-500' : ''
                        }}
                        title="Stock"
                        value={item?.stock > 0 ? (item?.stock / item?.volume).toFixed(0) : item?.stock}
                    />
                    <InfoBox
                        icon={{
                            name: 'Square'
                        }}
                        title="Min Stock"
                        value={item?.min_stock}
                    />
                    <InfoBox
                        icon={{
                            name: 'Square'
                        }}
                        title="Max Stock"
                        value={item?.max_stock}
                    />
                    <InfoBox
                        icon={{
                            name: 'Calendar'
                        }}
                        title="L.O. Date"
                        value={item?.last_order_date ? formatDate({
                            date: item?.last_order_date,
                            f: 'dd/MM/yyyy'
                        }) : 'N/A'}
                    />
                    <InfoBox
                        icon={{
                            name: 'Euro'
                        }}
                        title="L.O. Price"
                        value={convertCentsToEuro(item?.volume * (item?.last_order_one_vol_price || 0))}
                    />
                </div>
                <div className='flex justify-end w-full mt-4'>
                    <NewItemDialog
                        categories={{
                            categories: categories?.data || [],
                            categoriesParams,
                            setCategoriesParams
                        }}
                        update={{
                            item,
                            updateItem
                        }}
                    />
                </div>
            </div>
            <div className='flex-col-container gap-4 mt-4'>
                <ItemAnalytics
                    item={item}
                />
                <div className="p-4 bg-background-soft">
                    <OrdersTable
                        orders={orders || []}
                        setOrdersParams={setOrderParams}
                        ordersParams={orderParams}
                    />
                </div>
                <div className="p-4 bg-background-soft">
                    <ItemExtraEntreiesTable
                        extraEntries={extraEntries || []}
                        setExtraEntriesParams={setExtraEntriesParams}
                        extraEntriesParams={extraEntriesParams}
                    />
                </div>
                <div className="p-4 bg-background-soft">
                    <ItemHistoryTable
                        itemHistory={itemHistory || []}
                        setItemHistoryParams={setItemHistoryParams}
                        itemHistoryParams={itemHistoryParams}
                    />
                </div>
            </div>
        </div>
    )
}