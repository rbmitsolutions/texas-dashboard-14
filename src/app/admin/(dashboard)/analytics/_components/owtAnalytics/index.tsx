import { useCallback, useEffect, useState } from "react"

//components
import OrderControllerAnalytics from "./orderControllerAnalytics"
import AvgTableTimeAnalytics from "./avgTableTimeAnalytics"
import TablesServedAnalytics from "./tableServedAnalytics"
import InfoBox from "@/components/common/infoBox"
import WaiterAnalytics from "./waiterAnalytics"
import WrapSelect from "../wrapSelect"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { convertMinutesToHoursAndMinutes } from "@/common/libs/date-fns/dateFormat"

interface OwtAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

export interface IWaitressesData {
    waiter: string
    total: number
    orders: number
}

export default function OwtAnalytics({ date }: OwtAnalyticsProps) {
    const [selected, setSelected] = useState<string | undefined>(undefined)

    const {
        restaurantOrderAnalytics: waitressesData,
        isRestaurantDataFetching: isWaitressesDataFetching,
        setGETRestaurantDataParams: setWaitressesParams
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                analytics: {
                    totalByWaiter: '1',
                    date: {
                        gte: date.from,
                        lte: date.to
                    }
                }
            }
        }
    })

    const {
        restaurantOrderAnalytics: countOrders,
        setGETRestaurantDataParams: setCountOrders
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                analytics: {
                    count: '1',
                    date: {
                        gte: date.from,
                        lte: date.to
                    }
                }
            }
        }
    })

    const {
        restaurantFinishedTableAnalytics: finishedTablesCount,
        setGETRestaurantDataParams: setFinishedTablesCount
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                analytics: {
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    count: '1'
                }
            }
        }
    })

    const {
        restaurantFinishedTableAnalytics: finishedTablesAvgTime,
        setGETRestaurantDataParams: setFinishedTablesAvgTime
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                analytics: {
                    avg: {
                        total: '1',
                    },
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }
    })

    const renderOwtAnalytics = (selected: string) => {
        switch (selected) {
            case 'orders':
                return <OrderControllerAnalytics date={date} />
            case 'waiter':
                return <WaiterAnalytics date={date} data={waitressesData} />
            case 'tables':
                return <TablesServedAnalytics date={date} />
            case 'avg':
                return <AvgTableTimeAnalytics date={date} />
            default:
                return <div />
        }
    }


    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setWaitressesParams({
            orderController: {
                analytics: {
                    totalByWaiter: '1',
                    date: {
                        gte: date.from,
                        lte: date.to
                    }
                }
            }
        })
        setCountOrders({
            orderController: {
                analytics: {
                    count: '1',
                    date: {
                        gte: date.from,
                        lte: date.to
                    }
                }
            }
        })
        setFinishedTablesCount({
            finishedTables: {
                analytics: {
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    count: '1'
                }
            }
        })
        setFinishedTablesAvgTime({
            finishedTables: {
                analytics: {
                    avg: {
                        total: '1',
                    },
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }

        })
    }, [setWaitressesParams, setCountOrders, setFinishedTablesCount, setFinishedTablesAvgTime]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])


    const topWaitress: IWaitressesData = waitressesData?.length > 0 ? waitressesData[0] : { _count: { _all: 0 }, waiter: 'No Orders' }

    return (
        <div className='flex-col-container'>
            <strong>Orders / Waiters / Tables</strong>
            <div className='grid grid-cols-1 gap-2 bg-orange sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
                <WrapSelect
                    selected={selected === 'orders'}
                    handleSelect={() => setSelected(selected === 'orders' ? undefined : 'orders')}
                >
                    <InfoBox
                        icon={{
                            name: 'ChefHat',
                        }}
                        title='Total Orders'
                        value={countOrders || 0}
                    />
                </WrapSelect>
                <WrapSelect
                    selected={selected === 'waiter'}
                    handleSelect={() => setSelected(selected === 'waiter' ? undefined : 'waiter')}
                >
                    <InfoBox
                        icon={{
                            name: 'ListOrdered',
                        }}
                        title='Top Waiter'
                        value={topWaitress?.waiter}
                        smallValue={(String(topWaitress?.orders)) + ' Orders'}
                        isLoading={isWaitressesDataFetching}
                    />
                </WrapSelect>
                <WrapSelect
                    selected={selected === 'tables'}
                    handleSelect={() => setSelected(selected === 'tables' ? undefined : 'tables')}
                >
                    <InfoBox
                        icon={{
                            name: 'Dice4',
                        }}
                        title='Tables Served'
                        value={finishedTablesCount || 0}
                    />
                </WrapSelect>
                <WrapSelect
                    selected={selected === 'avg'}
                    handleSelect={() => setSelected(selected === 'avg' ? undefined : 'avg')}
                >
                    <InfoBox
                        icon={{
                            name: 'Clock',
                        }}
                        title='Avg Table Time'
                        value={convertMinutesToHoursAndMinutes(finishedTablesAvgTime?._avg?.average_minutes?.toFixed(0) || 0) || '0h 0m'}  
                    />

                </WrapSelect>
            </div>
            {selected &&
                <div className='flex-col-container p-4 bg-slate-100 dark:bg-slate-900'>
                    {renderOwtAnalytics(selected)}
                </div>
            }
        </div>
    )
}