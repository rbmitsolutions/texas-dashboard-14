//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import InfoBox from "@/components/common/infoBox"

//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks"


export interface IOrderAnalytics {
    product_id: string
    _sum: {
        total: number
    }
}

export interface IOrderControllerAnalytics {
    paid: boolean
    _count: {
        _all: number
    }
}


interface SupplierAnalyticsProps {
    supplier_id: string
}

export default function SupplierAnalytics({ supplier_id }: SupplierAnalyticsProps) {
    const {
        stockOrderAnalytics: orderAnalytics,
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    supplier: {
                        in: [supplier_id]
                    },
                    _sum: {
                        total: '1'
                    },
                    aggregate: '1'
                }
            }
        },
        UseQueryOptions: {
            enabled: !!supplier_id
        }
    })

    const {
        stockOrderControllerAnalytics: orderControllerAnalytics,
    } = useGETStockDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            order_controller: {
                analytics: {
                    supplier_id: {
                        in: [supplier_id]
                    },
                    groupByPaid: '1'
                }
            }
        },
        UseQueryOptions: {
            enabled: !!supplier_id
        }
    })

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {orderControllerAnalytics?.map((oc: IOrderControllerAnalytics) => {
                return (
                    <InfoBox
                        key={oc.paid.toString()}
                        icon={{
                            name: 'File',
                        }}
                        title={oc.paid ? 'Paid Orders' : 'Unpaid Orders'}
                        value={oc._count._all}
                    />
                )
            })}
           <InfoBox
           
                icon={{
                    name: 'Euro',
                }}
                title='Total Spent'
                value={convertCentsToEuro(orderAnalytics?._sum?.total || 0)}
            /> 
        </div>
    )
}