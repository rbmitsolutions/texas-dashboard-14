'use client'
import { io } from "socket.io-client";
import { useEffect } from "react";

//libs
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types";
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import BookingDetails from "./_components/bookingDetails";
import SearchInput from "@/components/common/searchInput";
import BookingButton from "./_components/bookingButton";
import LayoutFrame from "../../_components/layoutFrame";
import BookingHeader from "./_components/bookingHeader";
import WalkinButton from "./_components/walkinButton";
import FindBooking from "./_components/findBooking";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { BOOKING_STATUS } from "@/common/libs/restaurant/bookings";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/common/libs/shadcn/utils";

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function BookingPage() {
    const {
        restaurantBookingPageData: bookingPage,
        setGETRestaurantDataParams: setBookingPageParams,
        GETRestaurantDataParams: bookingPageParams,
        refetchRestaurantData: refetchBookingPage,
    } = useGETRestaurantDataHooks({
        query: 'OPEN_DAYS',
        keepParmas: true,
        defaultParams: {
            openDays: {
                bookingPage: {
                    short_day: formatDate({
                        date: new Date(),
                        f: 'ccc'
                    }),
                    date: new Date(),
                    status: {
                        in: ['arrived', 'canceled', 'confirmed', 'not_shown', 'unconfirmed', 'unconfirmed', 'walk_in']
                    },
                    // orderBy: {
                    //     key: 'status',
                    //     order: 'desc'
                    // }
                }
            }
        }
    })

    const {
        restaurantAllClients: clients,
        setGETRestaurantDataParams: setGETClientsParams,
        GETRestaurantDataParams: GETClientsParams,
    } = useGETRestaurantDataHooks({
        query: 'CLIENTS',
        defaultParams: {
            clients: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        createRestaurantData: createBooking,
    } = usePOSTRestaurantDataHooks({
        query: 'BOOKINGS',
    })

    const {
        updateRestaurantData: updateBooking,
    } = usePUTRestaurantDataHooks({
        query: 'BOOKINGS',
    })

    const {
        deleteRestaurantData: deleteBooking
    } = useDELETERestaurantDataHooks({
        query: 'BOOKINGS',
    })

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (message?.event === SocketIoEvent.BOOKING || message?.event === SocketIoEvent.BOOKING_CONFIG) {
                refetchBookingPage()
            }
        });
        () => {
            socket.off("message");
        }
    }, [refetchBookingPage]);

    console.log(bookingPageParams?.openDays?.bookingPage?.orderBy?.key + '/' + bookingPageParams?.openDays?.bookingPage?.orderBy?.order)
    return (
        <LayoutFrame
            navigation={{
                content: (
                    <div className='flex-col-container'>
                        <WalkinButton
                            times_open={bookingPage?.times_open || []}
                            createBooking={createBooking}
                            clients={clients?.data || []}
                            setGETClientsParams={setGETClientsParams}
                            GETClientsParams={GETClientsParams}
                        />
                        <BookingButton
                            createBooking={createBooking}
                        />
                        <FindBooking
                            deleteBooking={deleteBooking}
                            updateBooking={updateBooking}
                        />
                        <SearchInput
                            placeholder="Name"
                            onSearchChange={e => setBookingPageParams(prev => ({
                                openDays: {
                                    bookingPage: {
                                        ...prev?.openDays?.bookingPage,
                                        client: {
                                            ...prev?.openDays?.bookingPage?.client,
                                            name: e
                                        },
                                        short_day: prev?.openDays?.bookingPage?.short_day!,
                                        date: prev?.openDays?.bookingPage?.date!,
                                        orderBy: {
                                            key: 'status',
                                            order: 'desc'
                                        }
                                    }
                                }
                            }))}
                            value={bookingPageParams?.openDays?.bookingPage?.client?.name || ''}
                        />
                        <SearchInput
                            placeholder="Contact Number"
                            onSearchChange={e => setBookingPageParams(prev => ({
                                openDays: {
                                    bookingPage: {
                                        ...prev?.openDays?.bookingPage,
                                        client: {
                                            ...prev?.openDays?.bookingPage?.client,
                                            contact_number: e
                                        },
                                        short_day: prev?.openDays?.bookingPage?.short_day!,
                                        date: prev?.openDays?.bookingPage?.date!,
                                        orderBy: {
                                            key: 'status',
                                            order: 'desc'
                                        }
                                    }
                                }
                            }))}
                            value={bookingPageParams?.openDays?.bookingPage?.client?.contact_number || ''}
                        />
                        <div className='grid grid-cols-2 gap-1'>
                            {BOOKING_STATUS?.map(s => {
                                return (
                                    <label
                                        key={s?.title}
                                        className={cn('flex flex-col items-center gap-2 p-2', s?.bg)}
                                    >
                                        <small className='text-[8px]'>{s?.title}</small>
                                        <Switch
                                            checked={bookingPageParams?.openDays?.bookingPage?.status?.in?.includes(s?.status)}
                                            onCheckedChange={(checked) => setBookingPageParams(prev => ({
                                                openDays: {
                                                    bookingPage: {
                                                        ...prev?.openDays?.bookingPage,
                                                        status: {
                                                            in: checked ? [...prev?.openDays?.bookingPage?.status?.in!, s?.status] : prev?.openDays?.bookingPage?.status?.in?.filter(status => status !== s?.status) || []
                                                        },
                                                        date: prev?.openDays?.bookingPage?.date!,
                                                        short_day: prev?.openDays?.bookingPage?.short_day!,
                                                        client: prev?.openDays?.bookingPage?.client,
                                                        orderBy: prev?.openDays?.bookingPage?.orderBy,
                                                    }
                                                }
                                            }))}
                                        />
                                    </label>
                                )
                            })}
                        </div>
                        {/* <Select
                            value={bookingPageParams?.openDays?.bookingPage?.orderBy?.key + '/' + bookingPageParams?.openDays?.bookingPage?.orderBy?.order}
                            onValueChange={(e: string) => console.log({
                                orderBy: {
                                    key: e?.split('/')[0] as any,
                                    order: e?.split('/')[1] as 'asc' | 'desc'
                                }
                            })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Order By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Order By</SelectLabel>
                                    {[{
                                        title: 'Guests / ASC',
                                        value: 'amount_of_people/asc'
                                    }, {
                                        title: 'Guests / DESC',
                                        value: 'amount_of_people/desc'
                                    }, {
                                        title: 'Status / ASC',
                                        value: 'status/asc'
                                    }, {
                                        title: 'Status / DESC',
                                        value: 'status/desc'
                                    }]?.map(o => {
                                        return (
                                            <SelectItem key={o?.value} value={o?.value}>{o?.title}</SelectItem>
 
                                       )

                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select> */}
                    </div>
                )
            }}
        >
            <Wrap
                className='max-h-[95vh] w-full overflow-auto scrollbar-thin md:max-w-[calc(100vw-240px)]'
            >
                <div className='flex'>
                    {bookingPage?.times_open?.map(time => {
                        return (
                            <div key={time?.id} className='flex flex-col w-[120px] min-w-[120px] min-h-[95vh] px-1 odd:bg-background-soft'>
                                <BookingHeader time={time} />
                                <div className='flex-col-container gap-2 mt-4'>
                                    {time?.bookings?.bookings?.map(b => {
                                        return (
                                            <BookingDetails
                                                key={b?.id}
                                                booking={b}
                                                deleteBooking={deleteBooking}
                                                updateBooking={updateBooking}
                                                times_open={time}
                                            />
                                        )
                                    })}
                                    {time?.bookings?.canceled_not_shown?.map(b => {
                                        return (
                                            <BookingDetails
                                                key={b?.id}
                                                booking={b as any}
                                                deleteBooking={deleteBooking}
                                                updateBooking={updateBooking}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Wrap>
        </LayoutFrame >
    )
}
