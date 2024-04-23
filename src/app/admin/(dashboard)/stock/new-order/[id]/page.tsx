'use client'
import { useEffect, useState } from "react"

//libs
import { useDebounce } from "@/common/utils/useDebouce"

//components
import NewOrder from "./_components/newOrder"

//hooks
import { useGETStockDataHooks, usePOSTStockDataHooks } from "@/hooks/stock/stockDataHooks"

//interfaces
import { Button } from "@/components/ui/button"

export interface INewOrder {
    item_id: string
    supplier: string
    product_id: string
    product_quantity: number
    volume_quantity: number
    supplier_id: string
}

export default function Order({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<INewOrder[]>([])

    const {
        stockSupplier: supplier,
    } = useGETStockDataHooks({
        query: 'SUPPLIERS',
        defaultParams: {
            supplier: {
                byId: {
                    id: params.id,
                    include: {
                        products: '1'
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        stockAllProducts: products,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'PRODUCT',
        defaultParams: {
            product: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                    include: {
                        item: '1',
                        orders: {
                            delivery_date: '0'
                        }
                    },
                    supplier_id: {
                        in: [params.id]
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        createStockData: createOrder,
        isCreateStockDataLoading: isCreateOrderLoading
    } = usePOSTStockDataHooks({
        query: 'ORDER',
        toRefetch,
        UseMutationOptions: {
            onSuccess: () => {
                setOrder([])
            }
        }
    })

    const handleUpdateNewOrder = (newOrder: INewOrder) => {
        const productAlreadyInOrder = order.find(item => item?.product_id === newOrder?.product_id)

        if (newOrder?.product_quantity === 0 && productAlreadyInOrder) {
            setOrder(order.filter(item => item?.product_id !== newOrder?.product_id))
        }

        if (newOrder?.product_quantity > 0 && !productAlreadyInOrder) {
            setOrder([...order, newOrder])
        }

        if (newOrder?.product_quantity > 0 && productAlreadyInOrder) {
            setOrder(order.map(item => item?.product_id === newOrder?.product_id ? newOrder : item))
        }

        if (newOrder?.product_quantity === 0 && !productAlreadyInOrder) {
            return
        }
    }

    const onCreateOrder = async () => {
        if (!order?.length) return

        await createOrder({
            order: {
                many: {
                    orders: order,
                    supplier_id: params.id
                }
            }
        }, {
            onSuccess: async () => {
                setOrder([])
                await localStorage.removeItem('createStockOrder')
            }
        })
    }

    const saveLocal = useDebounce(() => {
        localStorage.setItem('createStockOrder', JSON.stringify(order))
    }, 2000)


    const getLocal = () => {
        const local = localStorage.getItem('createStockOrder')
        if (!local) return
        setOrder(JSON.parse(local))
    }

    useEffect(() => {
        saveLocal()
    }, [order, saveLocal])

    useEffect(() => {
        getLocal()
    }, [])

    return (
        <div className='flex-col-container items-center'>
            <h3 className='text-2xl font-bold'>{supplier?.title}</h3>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] max-w-4xl gap-4'>
                {products?.data?.map(product => {
                    return (
                        <NewOrder
                            key={product?.id}
                            product={product}
                            order={order}
                            handleUpdateNewOrder={handleUpdateNewOrder}
                            supplier={supplier}
                        />
                    )
                })}
            </div>
            <Button
                onClick={onCreateOrder}
                className='mt-4'
                isLoading={isCreateOrderLoading}
                leftIcon="Send"
                disabled={!order?.length}
            >
                Send Order
            </Button>
        </div>
    )
}
