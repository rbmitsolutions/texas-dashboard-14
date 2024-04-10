import { useCallback, useEffect, useState } from "react"
import { Area, Bar, Radar } from "recharts"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { api } from "@/common/libs/axios/api"

//components
import { BookingsColumnsTable } from "@/components/common/basicTable/columns/restaurant/bookingsColumns"
import ExcelDownloadButton from "@/components/common/excelDownloadButton"
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
import { IDataBooking, IDataBookingGuets, IDataBookingTime, transformBookingData, transformBookingTimeData } from "./utils"
import { IBookingStatus, IBookings } from "@/common/types/restaurant/bookings.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"

interface BookingsAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
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
                    by: ['status', 'amount_of_people'],
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
                    by: ['time', 'amount_of_people'],
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
                    },
                    orderBy: {
                        key: 'updated_at',
                        order: 'desc'
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!status
        }
    })

    const onDownload = async (status: IBookingStatus): Promise<any[] | undefined> => {
        try {
            const { data } = await api.get(EndPointsTypes['RESTAURANT_BOOKING_ENDPOINT'], {
                params: {
                    bookings: {
                        all: {
                            date: {
                                gte: date.from,
                                lte: date.to
                            },
                            status: [status],
                            include: {
                                client: '1'
                            },
                            pagination: {
                                take: 5000,
                                skip: 0
                            },
                            orderBy: {
                                key: 'updated_at',
                                order: 'desc'
                            }
                        }
                    }
                }
            })

            const bookings: IBookings[] = data?.data


            const finalData = bookings?.map(b => {
                return {
                    Date: formatDate({
                        date: b?.created_at,
                        f: 'dd/MM/yyyy'
                    }),
                    Time: b?.time,
                    Guests: b?.amount_of_people,
                    Status: b?.status,
                    Request: b?.request,
                    Client: b?.client?.name || 'Walk-in',
                    Contact: b?.client?.contact_number,
                }
            })

            return finalData || []
        } catch (err) {
            console.error(err)
        }
    }

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setBookingParams({
            bookings: {
                analytics: {
                    by: ['status', 'amount_of_people'],
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
                    by: ['time', 'amount_of_people'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    status: {
                        in: ['arrived', 'confirmed', 'unconfirmed', 'walk_in']
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
        setStatus(undefined)
    }, [setBookingParams, setBookingsParams, setBookingTimeParams, setBookingGuestsParams]);

    const onStatusChange = useCallback((status?: IBookingStatus) => {
        if (!status) return
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
    }, [date.from, date.to, setBookingsParams])

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    useEffect(() => {
        onStatusChange(status)
    }, [onStatusChange, status, date])

    const barChart = transformBookingData(bookingsData as IDataBooking[])

    const lineChart = transformBookingTimeData(bookingsTimeData as IDataBookingTime[])

    const radarChart = bookingsGuestsData?.map((item: IDataBookingGuets) => {
        return {
            name: item.amount_of_people,
            title: item?.amount_of_people + ' gts',
            bookings: item?._count._all,
            guests: (Number(item?.amount_of_people) * item?._count._all)
        }
    })

    const totalGuests = bookingsGuestsData?.reduce((acc: number, item: IDataBookingGuets) => acc + (Number(item?.amount_of_people) * item?._count._all), 0)

    return (
        <div className='flex-col-container'>
            <strong>Bookings</strong>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div className='h-80'>
                    <BarChart
                        data={barChart}
                        legend="Bookings / Guests"
                    >
                        <Bar
                            dataKey='bookings'
                        />
                        <Bar
                            dataKey='guests'
                        />
                    </BarChart>
                </div>
                <div className='h-80'>
                    <LineChart
                        data={lineChart}
                        legend='Confirmed / Arrived / Walk-in'
                    >
                        <Area
                            type='monotone'
                            dataKey='bookings'
                            fill='#075af56a'
                            stroke='#015cb1'
                        />
                        <Area
                            type='monotone'
                            dataKey='guests'
                            fill='#aa07f56a'
                            stroke='#8b3fb8'
                        />
                    </LineChart>
                </div>
                <div className='h-80'>
                    <RadarChart
                        data={radarChart}
                        legend="Guests per booking"
                    >
                        <Radar
                            dataKey="guests"
                            fill='#075af56a'
                            stroke='#015cb1'
                            fillOpacity={0.6}
                        />
                        <Radar
                            dataKey="bookings"
                            fill='#aa07f56a'
                            stroke='#8b3fb8'
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-2 bg-orange sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
                {barChart?.map((data) => {
                    return (
                        <WrapSelect
                            key={data?.name}
                            selected={status === data?.name}
                            handleSelect={() => setStatus(prev => prev === data?.name as IBookingStatus ? undefined : data?.name as IBookingStatus)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'CalendarCheck',
                                }}
                                title={data?.name}
                                value={data?.bookings || 0}
                                smallValue={`${data?.guests} gts` || '0 gst'}
                            />
                        </WrapSelect>
                    )
                })}
                <InfoBox
                    icon={{
                        name: 'Footprints',
                    }}
                    title='Guests'
                    smallValue="Servered"
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
                        actions={{
                            searchInput: {
                                onSearchChange: (search) => setBookingsParams(prev => ({
                                    bookings: {
                                        all: {
                                            ...prev?.bookings?.all,
                                            client: {
                                                name: search
                                            },
                                            date: {
                                                gte: date.from,
                                                lte: date.to
                                            }
                                        }
                                    }
                                })),
                                value: bookingsParams?.bookings?.all?.client?.name || '',
                                placeholder: 'Search by name'
                            },
                            optionsPopover: {
                                options: [
                                    {
                                        label: 'Sort by',
                                        value: `${bookingsParams?.bookings?.all?.orderBy?.key}/${bookingsParams?.bookings?.all?.orderBy?.order}` || 'created_at/desc',
                                        placeholder: 'Sort by',
                                        onChange: (e: string) => setBookingsParams(prev => ({
                                            bookings: {
                                                all: {
                                                    ...prev?.bookings?.all,
                                                    date: {
                                                        gte: date.from,
                                                        lte: date.to
                                                    },
                                                    orderBy: {
                                                        key: e.split('/')[0] as any,
                                                        order: e.split('/')[1] as any
                                                    }
                                                }
                                            }
                                        })),
                                        options: [
                                            {
                                                label: 'Date A-Z',
                                                value: 'updated_at/asc'
                                            },
                                            {
                                                label: 'Date Z-A',
                                                value: 'updated_at/desc'
                                            },
                                            {
                                                label: 'Guests A-Z',
                                                value: 'amount_of_people/asc'
                                            },
                                            {
                                                label: 'Guests Z-A',
                                                value: 'amount_of_people/desc'
                                            },
                                            {
                                                label: 'Time A-Z',
                                                value: 'time/asc'
                                            },
                                            {
                                                label: 'Time Z-A',
                                                value: 'time/desc'
                                            },
                                        ]
                                    }
                                ]
                            },
                            toRight: <>
                                <ExcelDownloadButton
                                    fileName={`bookings-${status}`}
                                    onDownload={() => onDownload(status)}
                                />
                            </>,
                            className: 'grid grid-cols-[1fr,auto,auto] items-center gap-2'
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

