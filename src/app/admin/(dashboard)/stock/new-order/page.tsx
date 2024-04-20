'use client'

import { RedirectTo } from "@/common/types/routers/endPoints.types"
import Wrap from "@/components/common/wrap"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks"
import Link from "next/link"

export default function NewOrders() {
    const {
        stockAllSuppliers: suppliers,
        GETStockDataParams: params,
        setGETStockDataParams: setParams,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'SUPPLIERS',
        defaultParams: {
            supplier: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 200
                    },
                    category: {
                        in: []
                    }
                }
            }
        }
    })

    const {
        stockAllCategory: categories,
    } = useGETStockDataHooks({
        query: 'CATEGORY',
        defaultParams: {
            category: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 500
                    },
                }
            }
        }
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Building2',
                    title: 'Suppliers'
                },
            }}
            actions={{
                searchInput: {
                    onSearchChange: (e) => setParams(prev => ({
                        supplier: {
                            all: {
                                ...prev?.supplier?.all,
                                title: e
                            }
                        }
                    })),
                    value: params?.supplier?.all?.title || ''
                },
                toRight: (
                    <div>
                        <Select
                            onValueChange={e => setParams(prev => ({
                                supplier: {
                                    all: {
                                        ...prev?.supplier?.all,
                                        category: {
                                            in: [e]
                                        }
                                    }
                                }

                            }))}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {categories?.data?.map(cat => {
                                        return (
                                            <SelectItem key={cat?.id} value={cat?.id} >
                                                <SelectLabel>{cat?.title}</SelectLabel>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                ),
                className: 'flex-container justify-between'
            }}
        >
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {suppliers?.data?.map(sup => {
                    return (
                        <Link
                            key={sup.id}
                            href={`${RedirectTo.NEW_ORDER}/${sup.id}`}
                            className='flex-container justify-center items-center p-4 h-20 rounded-lg bg-background-soft shadow-md'
                        >
                            <h5>
                                {sup?.title}
                            </h5>
                        </Link>
                    )
                })}
            </div>
        </Wrap>
    )
}