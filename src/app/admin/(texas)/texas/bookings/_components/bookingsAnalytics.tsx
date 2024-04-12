import { useCallback, useEffect, useState } from "react"
import { Area, Bar, Radar } from "recharts"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import LineChart from "@/components/common/charts/lineChart"
import InfoBox from "@/components/common/infoBox"
import { Button } from "@/components/ui/button"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IDataBooking, IDataBookingGuets, IDataBookingTime, ITransformBookingTimeReturn, transformBookingData, transformBookingTimeData } from "@/app/admin/(dashboard)/analytics/_components/bookingsAnalytics/utils"
import { IBookingStatus } from "@/common/types/restaurant/bookings.interface"

interface BookingAnalyticsDialogProps {
    date: Date
}
export default function BookingAnalyticsDialog({ date }: BookingAnalyticsDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
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
                        gte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: isOpen,
        }
    })

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
                        gte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: isOpen,
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
                        gte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: isOpen,
        }
    })


    const handleOpenChange = () => {
        setIsOpen(!isOpen)
    }

    const onDateChange = useCallback((date: Date) => {
        setBookingParams({
            bookings: {
                analytics: {
                    by: ['status', 'amount_of_people'],
                    date: {
                        gte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                }
            }
        })
        setBookingTimeParams({
            bookings: {
                analytics: {
                    by: ['time', 'amount_of_people'],
                    date: {
                        gte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        }))
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
                        gte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(date),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                }
            }

        })
    }, [setBookingParams, setBookingTimeParams, setBookingGuestsParams]);


    const lineChart = transformBookingTimeData(bookingsTimeData as IDataBookingTime[]).sort((a: ITransformBookingTimeReturn, b: ITransformBookingTimeReturn) => {
        return a?.name.localeCompare(b?.name)
    })

    const barChart = transformBookingData(bookingsData as IDataBooking[])

    const totalGuests = bookingsGuestsData?.reduce((acc: number, item: IDataBookingGuets) => acc + (Number(item?.amount_of_people) * item?._count._all), 0)


    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>
                <Button
                    size='iconExSm'
                    variant='purple'
                    onClick={handleOpenChange}
                >
                    <Icon name='LineChart' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Daily Analytics</DialogTitle>
                </DialogHeader>
                <div>
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
                    <div className='grid grid-cols-2 gap-2 mt-2 md:grid-cols-3'>
                        {barChart?.map((data) => {
                            return (
                                <InfoBox
                                    key={data?.name}
                                    icon={{
                                        name: 'CalendarCheck',
                                    }}
                                    title={data?.name}
                                    value={data?.bookings || 0}
                                    smallValue={`${data?.guests} gts` || '0 gst'}
                                />

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
                </div>
            </DialogContent>
        </Dialog>
    )
}