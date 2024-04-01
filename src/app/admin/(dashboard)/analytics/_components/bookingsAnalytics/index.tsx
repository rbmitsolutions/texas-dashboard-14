import { useCallback, useEffect, useState } from "react"
import { Area, Bar } from "recharts"

//libs
import { BOOKING_STATUS } from "@/common/libs/restaurant/bookings"

//components
import { BookingsColumnsTable } from "@/components/common/basicTable/columns/restaurant/bookingsColumns"
import RadarChart from "@/components/common/charts/radarChart"
import LineChart from "@/components/common/charts/lineChart"
import { BasicTable } from "@/components/common/basicTable"
import BarChart from "@/components/common/charts/barChart"
import InfoBox from "@/components/common/infoBox"
import Wrap from "@/components/common/wrap"
import WrapSelect from "../wrapSelect"

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

interface IDataBookingGuets {
    _count: {
        _all: number
    },
    amount_of_people: string
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
        restaurantBookingAnalytics: bookingsGuestsData,
        setGETRestaurantDataParams: setBookingGuestsParams,
    } = useGETRestaurantDataHooks({
        query: 'BOOKINGS',
        defaultParams: {
            bookings: {
                analytics: {
                    by: ['amount_of_people'],
                    status: {
                        in: ['arrived', 'confirmed', 'unconfirmed', 'walk_in']
                    },
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
        setBookingGuestsParams({
            bookings: {
                analytics: {
                    by: ['amount_of_people'],
                    status: {
                        in: ['arrived', 'confirmed', 'unconfirmed', 'walk_in']
                    },
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }

        })
    }, [setBookingParams, setBookingsParams, setBookingTimeParams, setBookingGuestsParams]);

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
            name: item.status,
            fill: getHexColor,
            bookings: item._count._all
        }
    })

    const lineChart = bookingsTimeData?.map((item: IDataBookingTime) => {
        return {
            name: item?.time,
            title: item.time,
            bookings: item._count._all
        }
    })

    const radarChart = bookingsGuestsData?.map((item: IDataBookingGuets) => {
        return {
            name: item.amount_of_people,
            value: item._count._all
        }
    })

    const totalGuests = bookingsGuestsData?.reduce((acc: number, item: IDataBookingGuets) => acc + item?._count?._all, 0)

    return (
        <div className='flex-col-container'>
            <strong>Bookings</strong>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div className='h-80'>
                    <BarChart
                        data={data}
                    >
                        <Bar
                            dataKey='bookings'
                            fill='fill'
                        />
                    </BarChart>
                </div>
                <div className='h-80'>
                    <LineChart
                        data={lineChart}
                    >
                        <Area
                            type='monotone'
                            dataKey='bookings'
                            fill='#075af56a'
                            stroke='#015cb1'
                        />
                    </LineChart>
                </div>
                <div className='relative h-80'>
                    <small className='absolute top-2 left-2'>Guests</small>
                    <RadarChart
                        data={radarChart}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 gap-2 bg-orange sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
                {bookingsData?.map((data: IDataBooking) => {
                    return (
                        <WrapSelect
                            key={data?.status}
                            selected={status === data?.status}
                            handleSelect={() => setStatus(status === data?.status ? undefined : data?.status)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'CalendarCheck',
                                }}
                                title={data?.status}
                                value={data?._count?._all || 0}
                            />
                        </WrapSelect>
                    )
                })}
                <InfoBox
                    icon={{
                        name: 'Footprints',
                    }}
                    title='Guests'
                    value={totalGuests || 0}
                />
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

                        <BasicTable
                            columns={BookingsColumnsTable({})}
                            data={bookings?.data || []}
                        />
                    </Wrap>
                </div>
            }
        </div>
    )
}