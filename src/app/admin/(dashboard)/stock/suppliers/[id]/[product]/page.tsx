'use client'

//components
import ProductAnalytics from "./_components/productAnalytics"

//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks"
import OrdersTable from "../../../_components/ordersTable/ordersTable"

export default function Product({ params }: { params: { id: string, product: string } }) {

    const {
        stockProducts: product,
    } = useGETStockDataHooks({
        query: 'PRODUCT',
        defaultParams: {
            product: {
                byId: {
                    id: params.product,
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.product
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
                    product_id: params.product,
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
            enabled: !!params.id && !!params.product
        }
    })

    return (
        <div>
            <h1 className='text-xl font-bold text-center mt-4'>{product?.title}</h1>
            <div className='flex-col-container gap-4 mt-8'>
                <ProductAnalytics supplier_id={params.id} product_id={params.product} />
                <div className='p-4 bg-background-soft'>
                    <OrdersTable
                        orders={orders}
                        setOrdersParams={setOrderParams}
                        ordersParams={orderParams}
                    />
                </div>
            </div>
        </div>
    )
}