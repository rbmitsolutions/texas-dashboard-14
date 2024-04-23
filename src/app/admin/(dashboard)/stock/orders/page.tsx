'use client'

//components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { StockOrderControllerColumns } from "./_components/stoclOrderControllerColumnsTable"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"

export default function Orders() {
    const {
        stockAllOrderController: ordersController,
        GETStockDataParams: ordersControllerParams,
        setGETStockDataParams: setOrdersControllerParams,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            order_controller: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        orders: '1',
                        supplier: '1',
                    },
                }
            }
        }
    })

    const {
        updateStockData: updateOrderController
    } = usePUTStockDataHooks({
        query: 'ORDER_CONTROLLER',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'PackageOpen',
                    title: 'Orders'
                },
                pagination: {
                    onPageChange: (pagination) => setOrdersControllerParams(prev => ({
                        order_controller: {
                            all: {
                                ...prev?.order_controller?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: ordersController?.pagination,
                    queryPagination: ordersControllerParams?.order_controller?.all?.pagination!,
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (search) => setOrdersControllerParams(prev => ({
                        order_controller: {
                            all: {
                                ...prev?.order_controller?.all,
                                supplier: {
                                    title: search
                                }
                            }
                        }
                    })),
                    value: ordersControllerParams?.order_controller?.all?.supplier?.title || '',
                    placeholder: 'Search by supplier'
                },
                toRight: (
                    <div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Paid" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Sort by</SelectLabel>
                                    <SelectItem value='all'>All</SelectItem>
                                    <SelectItem value='0'>Yes</SelectItem>
                                    <SelectItem value='1'>No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )
            }}
        >
            <BasicTable
                columns={StockOrderControllerColumns({
                    updateOrderController
                })}
                data={ordersController?.data || []}
            />
        </Wrap >
    )
}