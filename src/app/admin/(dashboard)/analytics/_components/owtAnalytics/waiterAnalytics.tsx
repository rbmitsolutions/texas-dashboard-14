import { useCallback, useEffect, useState } from "react";

//components
import { OrderControllerColumnsTable } from "@/components/common/basicTable/columns/restaurant/orderControllerColumns";
import { BasicTable } from "@/components/common/basicTable";
import InfoBox from "@/components/common/infoBox";
import Wrap from "@/components/common/wrap";
import WrapSelect from "../wrapSelect";

//interface
import { IWaitressesData } from ".";

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

interface WaiterAnalyticsProps {
    data: IWaitressesData[]
    date: { from: Date, to: Date }
}
export default function WaiterAnalytics({ data, date }: WaiterAnalyticsProps) {
    const [waiter, setWaiter] = useState<string | undefined>(undefined)
    const {
        restaurantAllOrderController: orderControllers,
        setGETRestaurantDataParams: setOrderControllerParams,
        GETRestaurantDataParams: orderControllerParams
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                all: {
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    waiter
                }
            }
        },
        UseQueryOptions: {
            enabled: !!waiter
        }
    })
    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setOrderControllerParams({
            orderController: {
                all: {
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                }
            }
        })
    }, [setOrderControllerParams]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    useEffect(() => {
        if (waiter) {
            setOrderControllerParams(({
                orderController: {
                    all: {
                        includes: {
                            orders: '1'
                        },
                        date: {
                            gte: date.from,
                            lte: date.to
                        },
                        waiter,
                        pagination: {
                            take: 20,
                            skip: 0
                        }
                    }
                }
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setOrderControllerParams, waiter])

    return (
        <div className='flex-col-container gap-4'>
            <div className='grid grid-cols-1 gap-2 bg-orange sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
                {data?.map(w => {
                    return (
                        <WrapSelect
                            key={w?.waiter}
                            selected={waiter === w?.waiter}
                            handleSelect={() => setWaiter(waiter === w?.waiter ? undefined : w?.waiter)}
                        >
                            <InfoBox

                                icon={{
                                    name: 'List',
                                }}
                                title={w?.waiter}
                                value={w?._count?._all || 0}
                            />
                        </WrapSelect>
                    )
                })}
            </div>
            {waiter && (
                <Wrap
                    header={{
                        title: {
                            title: 'Transactions',
                            icon: 'PiggyBank'
                        },
                        pagination: {
                            onPageChange: (pagination) => setOrderControllerParams(prev => ({
                                orderController: {
                                    all: {
                                        ...prev?.orderController?.all,
                                        pagination: pagination
                                    }
                                }
                            })),
                            pagination: orderControllers?.pagination,
                            queryPagination: orderControllerParams?.orderController?.all?.pagination!,
                        }
                    }}
                >
                    <BasicTable
                        columns={OrderControllerColumnsTable({})}
                        data={orderControllers?.data || []}
                    />
                </Wrap>
            )}
        </div>
    )
}