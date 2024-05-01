'use client'
import { useEffect, useState } from "react"

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"

//components
import StockOrderAuthorizedTable from "./_components/stockOrderAuthorizedTable"
import NotDeliveredOrder from "./_components/notDeliveredOrder"

//hooks
import { useDELETEStockDataHooks, useGETStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { IStockOrders } from "@/common/types/restaurant/stock.interface"
import { Permissions } from "@/common/types/auth/auth.interface"
import { useDebounce } from "@/common/utils/useDebouce"

export interface IOrderChange {
    orderId: string
    type: 'deposit' | 'vat' | 'one_product_price'
    value: number
}

export default function StockOrderControllerPage({ params }: { params: { id: string } }) {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [ordersNotDelivered, setOrdersNotDelivered] = useState<IStockOrders[]>([])
    const [ordersDelivered, setOrdersDelivered] = useState<IStockOrders[]>([])
    const { user } = useAuthHooks()
    const {
        stockOrderController: ordersController,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            order_controller: {
                byId: {
                    id: params.id,
                    include: {
                        orders: {
                            item: '1',
                            product: '1',
                        },
                        supplier: '1',
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data: any) => {
                const orders: IStockOrders[] = data?.orders
                if (orders) {
                    setOrdersNotDelivered(orders?.filter(order => !order.delivery_date))
                    setOrdersDelivered(orders?.filter(order => order.delivery_date))
                }
            },
            enabled: !!params.id
        }
    })

    const {
        updateStockData: updateOrder,
        isUpdateStockDataLoading: isUpdateOrderLoading
    } = usePUTStockDataHooks({
        query: 'ORDER',
        showNotification: false,
        toRefetch,
    })

    const {
        deleteStockData: deleteOrder,
        isDeleteStockDataLoading: isDeleteOrderLoading
    } = useDELETEStockDataHooks({
        query: 'ORDER',
        toRefetch
    })

    const handleSaveOrder = async (order: IStockOrders) => {
        await updateOrder({
            order
        })
    }

    const onOrderChange = async (data: IOrderChange) => {
        const order = ordersDelivered?.find(order => order.id === data?.orderId)


        if (order) {
            let orderUpdated = {
                id: order?.id,
                deposit: order?.deposit,
                vat: order?.vat,
                one_product_price: order?.one_product_price,
                product_price: order?.product_price,
                total: order?.total,
                product_quantity: order?.product_quantity,
                product: order?.product,
                item: order?.item,
                one_volume_price: order?.one_volume_price
            }

            if (orderUpdated.id === data?.orderId) {
                if (data?.type === 'deposit') {
                    orderUpdated.deposit = data?.value;
                }
                if (data?.type === 'vat') {
                    orderUpdated.vat = data?.value;
                }
                if (data?.type === 'one_product_price') {
                    orderUpdated.one_product_price = data?.value;
                }

                orderUpdated.product_price = orderUpdated.one_product_price * orderUpdated.product_quantity;
                orderUpdated.total = orderUpdated?.vat > 0 ? (orderUpdated?.product_price + (orderUpdated?.product_price * (orderUpdated?.vat / 100))) + orderUpdated?.deposit : orderUpdated?.deposit + orderUpdated?.product_price

                const oneItemPriceVolumeWithVat = ((orderUpdated?.total / orderUpdated?.product_quantity) / orderUpdated?.product?.pack_quantity) / orderUpdated?.item?.volume

                orderUpdated.one_volume_price = Number(oneItemPriceVolumeWithVat.toFixed(4))
            }

            if (orderUpdated?.total !== order?.total || orderUpdated?.deposit !== order?.deposit || orderUpdated?.vat !== order?.vat) {
                await handleSaveOrder(orderUpdated as IStockOrders)
            }
        }
    }


    useEffect(() => {
        if (user) {
            setIsAuthorized(isUserAuthorized(user, [Permissions.ADMIN, Permissions.STOCK_MANAGER]))
        }
    }, [user])

    return (
        <div className='flex-col-container items-center'>
            {isAuthorized ?
                <>
                    <h3 className='text-2xl font-bold'>{ordersController?.supplier?.title}</h3>
                    <div className='w-full mb-4'>
                        <StockOrderAuthorizedTable
                            orderController={ordersController}
                            orders={ordersDelivered || []}
                            supplier={ordersController?.supplier || {}}
                            onOrderChange={onOrderChange}
                            deleteOrder={deleteOrder}
                        />
                    </div>
                </>
                : null}
            {ordersNotDelivered?.length && isAuthorized ?
                <>
                    <h3 className='text-2xl font-bold'>Orders Not Delivred</h3>
                    <div className='grid grid-cols-1fr gap-4 md:grid-cols-2'>
                        {ordersNotDelivered?.map(order => {
                            return (
                                <NotDeliveredOrder
                                    key={order?.id}
                                    order={order}
                                    user={user}
                                    supplier={ordersController?.supplier || {}}
                                    updateOrder={updateOrder}
                                    deleteOrder={deleteOrder}
                                    isLoading={isUpdateOrderLoading || isDeleteOrderLoading}
                                />
                            )
                        })}
                    </div>
                </>
                : null
            }
        </div>
    )
}