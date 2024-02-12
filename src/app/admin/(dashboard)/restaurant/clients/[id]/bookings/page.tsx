'use client'

//components
import Wrap from "@/components/common/wrap"
import { clientBookingsColumnsTable } from "./_components/clientBookingsColumnsTable"
import { ClientBookingsTable } from "./_components/clientBookingsTable"

//libs
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/common/libs/date-fns/dateFormat"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IQueryPagination } from "@/common/types/settings.interface"

export default function ClientPage({ params }: { params: { id: string } }): JSX.Element {
    const {
        restaurantAllBookings: bookings,
        setGETRestaurantDataParams: setBookings,
        GETRestaurantDataParams: bookingsParams,
        isRestaurantDataLoading: isLoading,
        restaurantDataError: error
    } = useGETRestaurantDataHooks({
        query: 'BOOKINGS',
        keepParmas: true,
        defaultParams: {
            bookings: {
                all: {
                    client_id: params?.id,
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    date: {
                        gte: getFirstDayOfMonth(new Date()),
                        lte: getLastDayOfMonth(new Date())
                    },
                }
            }
        }
    })

    return (
        <Wrap
            header={{
                title: {
                    title: 'Bookings',
                    icon: 'CalendarCheck'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setBookings(prev => ({
                        clients: {
                            all: {
                                ...prev,
                                pagination
                            }
                        }
                    })),
                    pagination: bookings?.pagination,
                    queryPagination: bookingsParams?.clients?.all?.pagination!
                }
            }}
            actions={{
                dateChange:{
                    datePickerWithRange:{
                        onConfirm: (date) => setBookings(prev => ({
                            bookings: {
                                all: {
                                    ...prev?.bookings?.all,
                                    date: {
                                        gte: new Date(date?.from!),
                                        lte: new Date(date?.to!)
                                    },
                                }
                            }
                        })) ,
                        max: 180
                    }
                },
                className: 'flex'
            }}
            isLoading={isLoading}
            error={error}

        >
            <ClientBookingsTable
                columns={clientBookingsColumnsTable}
                data={bookings?.data}
            />
        </Wrap>
    )
}