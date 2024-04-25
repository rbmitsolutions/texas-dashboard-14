import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Area } from "recharts";

//libs
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth, getLastTimeOfTheDay } from "@/common/libs/date-fns/dateFormat";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";

//components
import { DatePickerWithRange } from "@/components/common/datePicker";
import LineChart from "@/components/common/charts/lineChart";
import InfoBox from "@/components/common/infoBox";

//utils
import { ILastOrderPrice, transformLastOrderPriceData } from "./utils";

//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks";

//interface
import { IStockItem } from "@/common/types/restaurant/stock.interface";

interface ItemAnalyticsProps {
    item: IStockItem;
}

export default function ItemAnalytics({ item }: ItemAnalyticsProps) {
    const { id } = useParams()
    const [date, setDate] = useState<{
        from: Date
        to: Date
    }>({
        from: new Date(formatDate({
            date: getFirstDayOfMonth(new Date()),
            f: 'yyyy-MM-dd',
        })),
        to: getLastDayOfMonth(new Date()),
    })

    const onDateChange = (date: DateRange | undefined) => {
        if (date) {
            const { from, to } = date
            setDate({
                from: new Date(formatDate({
                    date: new Date(from!),
                    f: 'yyyy-MM-dd',
                })),
                to: getLastTimeOfTheDay(new Date(to!)),
            })
        }
    }

    const {
        stockOrderAnalytics: orderAnalyticsSumTotal,
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    item: {
                        in: [id as string]
                    },
                    _sum: {
                        total: '1'
                    },
                    aggregate: '1'
                }
            }
        },
        UseQueryOptions: {
            enabled: !!id
        }
    })

    const {
        stockOrderAnalytics: orderAnalyticsCount,
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    item: {
                        in: [id as string]
                    },
                    count: '1',
                }
            }
        },
        UseQueryOptions: {
            enabled: !!id
        }
    })

    const {
        stockOrderAnalytics: orderAnalyticsGroup,
        setGETStockDataParams: setOrderAnalyticsGroupParams,
    } = useGETStockDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    item: {
                        in: [id as string]
                    },
                    groupBy: {
                        by: ['created_at']
                    },
                    delivery_date: {
                        gte: date?.from,
                        lte: date?.to
                    },
                    _sum: {
                        one_volume_price: '1'
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: !!id
        }
    })

    const onChange = useCallback((date: DateRange | undefined) => {
        if (date) {
            setOrderAnalyticsGroupParams(prev => ({
                order: {
                    analytics: {
                        ...prev?.order?.analytics,
                        delivery_date: {
                            gte: new Date(date?.from!),
                            lte: new Date(date?.to!)
                        },
                    }
                }
            }))
        }
    }, [setOrderAnalyticsGroupParams])

    useEffect(() => {
        onChange(date)
    }, [date, onChange])


    const lineChart = transformLastOrderPriceData(date, orderAnalyticsGroup || [], item) || []

    const bestPrice: ILastOrderPrice = orderAnalyticsGroup?.length > 0 ? orderAnalyticsGroup?.reduce((prev: any, current: ILastOrderPrice) => (prev._sum?.one_volume_price < current._sum?.one_volume_price) ? prev : current) : {}

    const expensivePrice = lineChart?.reduce((prev, current) => (prev.total > current.total) ? prev : current)

    return (
        <div className='flex-col-container'>
            <div className='flex-container justify-between'>
                <h1 className='text-2xl font-bold'>Analytics</h1>
                <DatePickerWithRange
                    onConfirm={onDateChange}
                    max={365}
                    value={{
                        from: date?.from,
                        to: date?.to
                    }}
                    toDate={new Date()}
                />
            </div>
            <div className='grid grid-cols-1'>
                <div className='min-h-[400px]'>
                    <LineChart
                        data={lineChart}
                        legend='Last Order Price'
                    >
                        <Area
                            type='monotone'
                            dataKey='total'
                            fill='#075af56a'
                            stroke='#015cb1'
                        />
                    </LineChart>
                </div>
            </div>
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
                <InfoBox
                    icon={{
                        name: 'Euro'
                    }}
                    title="Best Price Paid"
                    value={convertCentsToEuro(bestPrice?._sum?.one_volume_price * item?.volume || 0)}
                    smallValue={bestPrice?.created_at ? formatDate({
                        date: new Date(bestPrice?.created_at),
                        f: 'dd/MM/yy'
                    }) : 'N/A'}
                />
                <InfoBox
                    icon={{
                        name: 'Euro'
                    }}
                    title="Worst Price Paid"
                    value={convertCentsToEuro(expensivePrice?.total * 100 || 0)}
                    smallValue={expensivePrice?.name}
                />
            </div>
        </div>
    )
}