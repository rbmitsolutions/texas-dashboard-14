import { useCallback, useEffect, useState } from "react"

//libs
import { BOOKING_STATUS } from "@/common/libs/restaurant/bookings"
import { cn } from "@/common/libs/shadcn/utils"

//components
import LineChart from "@/components/common/charts/lineChart"
import BarChart from "@/components/common/charts/barChart"
import { BookingsColumnsTable } from "./bookingsColumns"
import InfoBox from "@/components/common/infoBox"
import { BookingsTables } from "./bookingsTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IBookingStatus } from "@/common/types/restaurant/bookings.interface"

interface BookingsAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

interface IDataBooking {
    _count: {
        _all: number
    },
    status: IBookingStatus
}

interface IDataBookingTime {
    _count: {
        _all: number
    },
    time: string
}

export default function BookingsAnalytics({ date }: BookingsAnalyticsProps) {
    const [status, setStatus] = useState<IBookingStatus | undefined>(undefined)

    const {
        restaurantBookingAnalytics: bookingsData,
        setGETRestaurantDataParams: setBookingParams,
    } = useGETRestaurantDataHooks({
        query: 'BOOKINGS',
        defaultParams: {
            bookings: {
                analytics: {
                    by: ['status'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }
    })

    const {
        restaurantBookingAnalytics: bookingsTimeData,
        setGETRestaurantDataParams: setBookingTimeParams,
    } = useGETRestaurantDataHooks({
        query: 'BOOKINGS',
        defaultParams: {
            bookings: {
                analytics: {
                    by: ['time'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }
    })

    const {
        restaurantAllBookings: bookings,
        GETRestaurantDataParams: bookingsParams,
        setGETRestaurantDataParams: setBookingsParams,
    } = useGETRestaurantDataHooks({
        query: 'BOOKINGS',
        defaultParams: {
            bookings: {
                all: {
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    status: [(status || 'arrived')],
                    include: {
                        client: '1'
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!status
        }
    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setBookingParams({
            bookings: {
                analytics: {
                    by: ['status'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        })
        setBookingsParams(prev => ({
            bookings: {
                all: {
                    ...prev?.bookings?.all,
                    date: {
                        gte: date.from,
                        lte: date.to
                    }
                }
            }
        }))
        setBookingTimeParams({
            bookings: {
                analytics: {
                    by: ['time'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },  
                }
            }
        })
    }, [setBookingParams, setBookingsParams, setBookingTimeParams]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    useEffect(() => {
        if (status) {
            setBookingsParams(prev => ({
                bookings: {
                    all: {
                        ...prev?.bookings?.all,
                        status: [status],
                        pagination: {
                            take: 20,
                            skip: 0
                        },
                        date: {
                            gte: date.from,
                            lte: date.to
                        }
                    }
                }
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setBookingsParams, status])

    const data = bookingsData?.map((item: IDataBooking) => {
        const getHexColor = BOOKING_STATUS?.find(status => status?.status === item.status)?.hex
        return {
            title: item.status,
            fill: getHexColor,
            value: item._count._all
        }
    })

    const lineChart = bookingsTimeData?.map((item: IDataBookingTime, index: number) => {
        return {
            title: item.time,
            value: item._count._all
        }
    })

    return (
        <div className='flex-col-container'>
            <strong>Bookings</strong>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='h-80'>
                    <BarChart
                        data={data}
                    />
                </div>
                <div className='h-80'>
                    <LineChart
                        data={lineChart}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 gap-2 bg-orange sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
                {bookingsData?.map((data: IDataBooking) => {
                    return (
                        <div
                            key={data?.status}
                            className={cn('border-2 rounded-2xl cursor-pointer w-full', data?.status === status ? 'border-primary' : 'border-transparent')}
                            onClick={() => setStatus(status === data?.status ? undefined : data?.status)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={data?.status}
                                value={data?._count?._all || 0}
                            />
                        </div>
                    )
                })}
            </div>
            {status &&
                <div className='flex-col-container p-4 bg-slate-100 dark:bg-slate-900'>
                    <Wrap
                        header={{
                            title: {
                                title: status || 'Bookings',
                                icon: 'Calendar'
                            },
                            pagination: {
                                onPageChange: (pagination) => setBookingsParams(prev => ({
                                    bookings: {
                                        all: {
                                            ...prev?.bookings?.all,
                                            pagination,
                                            date: {
                                                gte: date.from,
                                                lte: date.to
                                            }
                                        }
                                    }
                                })),
                                pagination: bookings?.pagination,
                                queryPagination: bookingsParams?.bookings?.all?.pagination!,
                            }
                        }}
                    >

                        <BookingsTables
                            columns={BookingsColumnsTable({})}
                            data={bookings?.data || []}
                        />
                    </Wrap>
                </div>
            }
        </div>
    )
}