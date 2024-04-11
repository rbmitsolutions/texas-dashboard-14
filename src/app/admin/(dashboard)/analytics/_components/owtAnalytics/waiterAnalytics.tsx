import { useCallback, useEffect, useState } from "react";

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { api } from "@/common/libs/axios/api";

//components
import { OrderControllerColumnsTable } from "@/components/common/basicTable/columns/restaurant/orderControllerColumns";
import ExcelDownloadButton from "@/components/common/excelDownloadButton";
import { BasicTable } from "@/components/common/basicTable";
import InfoBox from "@/components/common/infoBox";
import Wrap from "@/components/common/wrap";
import WrapSelect from "../wrapSelect";

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

//interface
import { IOrderController } from "@/common/types/restaurant/order.interface";
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";
import { IWaitressesData } from ".";
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { getOrderTotal } from "@/common/libs/restaurant/order";

interface WaiterAnalyticsProps {
    data: IWaitressesData[]
    date: { from: Date, to: Date }
}
export default function WaiterAnalytics({ data, date }: WaiterAnalyticsProps) {
    const [waiter, setWaiter] = useState<string | undefined>(undefined)
    const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false)
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

    const {
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

    const onDownload = async (waiter: string): Promise<any[] | undefined> => {
        setIsDownloadLoading(true)
        try {
            const { data } = await api.get(EndPointsTypes['RESTAURANT_ORDER_CONTROLLER_ENDPOINT'], {
                params: {
                    orderController: {
                        all: {
                            date: {
                                gte: date.from,
                                lte: date.to
                            },
                            includes: {
                                orders: '1'
                            },
                            pagination: {
                                take: 5000,
                                skip: 0
                            },
                            waiter,
                            orderBy: {
                                key: 'updated_at',
                                order: 'desc'
                            }
                        }
                    }
                }
            })

            const orderController: IOrderController[] = data?.data

            let finalData: any[] = []

            // const uniqueOrders = new Map()
            orderController?.map(oc => {
                oc?.orders?.map(o => {

                    // if (!uniqueOrders.has(o?.id)) {
                    //     uniqueOrders.set(o?.id, o)
                    // } else {
                    //     const existingOrder = uniqueOrders.get(o?.id)
                    //     existingOrder.quantity += o?.quantity
                    //     existingOrder.total += getOrderTotal(o)
                    // }
                    finalData.push({
                        Date: formatDate({
                            date: o?.created_at,
                            f: 'dd/MM/yyyy'
                        }),
                        Quantity: o?.quantity,
                        Status: o?.status,
                        Item: o?.menu,
                        ShortTitle: o?.menu_short_title,
                        Total: getOrderTotal(o) / 100,
                    })
                })
            })

            // uniqueOrders.forEach(value => {
            //     finalData.push({
            //         Date: formatDate({
            //             date: value?.created_at,
            //             f: 'dd/MM/yyyy'
            //         }),
            //         Quantity: value?.quantity,
            //         Status: value?.status,
            //         Item: value?.menu,
            //         ShortTitle: value?.menu_short_title,
            //         Total: value?.price,
            //     })
            // })

            return finalData || []
        } catch (err) {
            console.error(err)
        } finally {
            setIsDownloadLoading(false)
        }
    }

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
                                value={convertCentsToEuro(w?.total || 0)}
                                smallValue={w?.orders + ' Orders'}
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
                    actions={{
                        toRight: (
                            <>
                                <ExcelDownloadButton
                                    fileName={`${waiter}-Sales`}
                                    onDownload={() => onDownload(waiter)}
                                    isLoading={isDownloadLoading}
                                />
                            </>
                        ),
                        className: 'flex justify-end'
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