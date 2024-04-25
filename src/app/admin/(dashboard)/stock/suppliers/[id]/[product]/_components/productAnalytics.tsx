//untils
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import InfoBox from "@/components/common/infoBox"

//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks"

interface ProductAnalyticsProps {
    supplier_id: string
    product_id: string
}

export default function ProductAnalytics({ supplier_id, product_id }: ProductAnalyticsProps) {

    const {
        stockOrderAnalytics: orderAnalyticsSumTotal,
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    supplier: {
                        in: [supplier_id]
                    },
                    product_id: {
                        in: [product_id]
                    },
                    _sum: {
                        total: '1'
                    },
                    aggregate: '1'
                }
            }
        },
        UseQueryOptions: {
            enabled: !!supplier_id && !!product_id
        }
    })

    const {
        stockOrderAnalytics: orderAnalyticsCount,
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    supplier: {
                        in: [supplier_id]
                    },
                    product_id: {
                        in: [product_id]
                    },
                    count: '1',
                }
            }
        },
        UseQueryOptions: {
            enabled: !!supplier_id && !!product_id
        }
    })

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <InfoBox
                icon={{
                    name: 'PackageOpen'
                }}
                title="Orders"
                value={orderAnalyticsCount || 0}
            />
            <InfoBox
                icon={{
                    name: 'Euro'
                }}
                title="Total Spent"
                value={convertCentsToEuro(orderAnalyticsSumTotal?._sum?.total || 0)}
            />
        </div>
    )
}