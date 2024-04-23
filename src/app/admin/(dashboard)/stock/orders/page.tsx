'use client'

//components
import { StockOrderControllerColumns } from "./_components/stoclOrderControllerColumnsTable"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks"

export default function Orders() {
    const {
        stockAllOrderController: ordersController,
        GETStockDataParams: ordersControllerParams,
        setGETStockDataParams: setOrdersControllerParams,
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
                    }
                }
            }
        }
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
                    placeholder : 'Search by supplier'
                },
            }}
        >
            <BasicTable
                columns={StockOrderControllerColumns({
                })}
                data={ordersController?.data || []}
            />
        </Wrap >
    )
}