'use client'

//hooks
import { useDELETEStockDataHooks, useGETStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"
import OrdersControllerTable from "../_components/ordersControllerTable/ordersControllerTable"

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

    const {
        deleteStockData: deleteOrderController
    } = useDELETEStockDataHooks({
        query: 'ORDER_CONTROLLER',
        toRefetch
    })

    return (
        <OrdersControllerTable 
            ordersController={ordersController}
            ordersControllerParams={ordersControllerParams}
            setOrdersControllerParams={setOrdersControllerParams}
            updateOrderController={updateOrderController}
            deleteOrderController={deleteOrderController}
        />
    )
}