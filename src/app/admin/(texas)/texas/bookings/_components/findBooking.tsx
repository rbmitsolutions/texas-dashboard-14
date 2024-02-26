import { UseMutateFunction } from "react-query";

//libs
import { addDaysToDate } from "@/common/libs/date-fns/dateFormat";
import Icon from "@/common/libs/lucida-icon";

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";
import BookingDetails from "./bookingDetails";

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

//interfaces
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";

interface FindBookingProps {
    iconOnly?: boolean;
    deleteBooking: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    updateBooking: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    isUserAuth: boolean
    isLoading: boolean
}


export default function FindBooking({ updateBooking, iconOnly, isUserAuth, deleteBooking, isLoading }: FindBookingProps): JSX.Element {
    const {
        restaurantAllBookings: bookings,
        setGETRestaurantDataParams: setBookingsParams,
        GETRestaurantDataParams: bookingsParams,
        refetchRestaurantData: refetchBookingPage,
    } = useGETRestaurantDataHooks({
        query: 'BOOKINGS',
        defaultParams: {
            bookings: {
                all: {
                    date: {
                        gte: new Date(),
                        lte: addDaysToDate(new Date(), 240)
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    status: ['confirmed', 'unconfirmed', 'canceled'],
                    include: {
                        client: '1',
                        table: "1"
                    }
                }
            }
        },
    })

    return (
        <Sheet>
            <SheetTrigger asChild>
                {iconOnly ?
                    <Button
                        variant='green'
                        className='h-20 w-full'
                    >
                        <Icon name='Search' />
                    </Button>
                    :
                    <Button
                        leftIcon='Search'
                        variant='green'
                        className='h-20 w-full'
                    >
                        Find Booking
                    </Button>
                }
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle>Find Booking</SheetTitle>
                    <SearchInput
                        placeholder="Search by name"
                        onSearchChange={e => setBookingsParams(prev => ({
                            bookings: {
                                all: {
                                    ...prev?.bookings?.all,
                                    client: {
                                        ...prev?.bookings?.all?.client,
                                        name: e
                                    },
                                    date: {
                                        gte: new Date(),
                                        lte: addDaysToDate(new Date(), 240)
                                    }
                                }
                            }
                        }))}
                        value={bookingsParams?.bookings?.all?.client?.name || ''}
                    />
                    <SearchInput
                        placeholder="Search by contact number"
                        onSearchChange={e => setBookingsParams(prev => ({
                            bookings: {
                                all: {
                                    ...prev?.bookings?.all,
                                    client: {
                                        ...prev?.bookings?.all?.client,
                                        contact_number: e
                                    },
                                    date: {
                                        gte: new Date(),
                                        lte: addDaysToDate(new Date(), 240)
                                    }
                                }
                            }
                        }))}
                        value={bookingsParams?.bookings?.all?.client?.contact_number || ''}
                    />
                    <SearchInput
                        placeholder="Search by email"
                        onSearchChange={e => setBookingsParams(prev => ({
                            bookings: {
                                all: {
                                    ...prev?.bookings?.all,
                                    client: {
                                        ...prev?.bookings?.all?.client,
                                        email: e
                                    },
                                    date: {
                                        gte: new Date(),
                                        lte: addDaysToDate(new Date(), 240)
                                    }
                                }
                            }
                        }))}
                        value={bookingsParams?.bookings?.all?.client?.email || ''}
                    />
                </SheetHeader>
                <div className='p-2 overflow-auto scrollbar-thin'>
                    <div className='grid grid-cols-2 justify-start gap-4'>
                        {bookings?.data?.map(b => {
                            return (
                                <BookingDetails
                                    key={b.id}
                                    booking={b as any}
                                    updateBooking={updateBooking}
                                    deleteBooking={deleteBooking}
                                    isUserAuth={isUserAuth}
                                    isUpdateBookingLoading={isLoading}
                                />
                            )
                        })}
                    </div>
                </div>
                <SheetFooter>
                    {/* <Button
                        className='w-full h-12'
                        variant='purple'
                        leftIcon="Stethoscope"
                        disabled={!isUserAuthorized(
                            UserToken,
                            [Permissions.ADMIN]
                        ) || roster?.status === 'dayoff' || roster?.status === 'holiday' || roster?.status === 'sickday'}
                        onClick={handleUpdateRoster}
                    >
                        Update to Sick Day
                    </Button> */}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}