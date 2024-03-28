import Wrap from "@/components/common/wrap";
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useCallback, useEffect } from "react";
import { OrderControllerColumnsTable } from "./orderControllerColumns";
import { BasicTable } from "@/components/common/basicTable";

interface OrderControllerAnalyticsProps {
    date: { from: Date, to: Date }
}
export default function OrderControllerAnalytics({ date }: OrderControllerAnalyticsProps) {

    const {
        restaurantAllOrderController: orderControllers,
        setGETRestaurantDataParams: setOrderControllerParams,
        GETRestaurantDataParams: orderControllerParams
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                all: {
                    includes: {
                        orders: '1'
                    },
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
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
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }))
    }, [setOrderControllerParams]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
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
    )
}