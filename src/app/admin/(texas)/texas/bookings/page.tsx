'use client'
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { cn } from "@/common/libs/shadcn/utils";

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
import { Switch } from "@/components/ui/switch";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

//interfaces
import { IGETBookingsPageReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { BOOKING_STATUS, IBookingPageFilter, bookingPagefilter } from "@/common/libs/restaurant/bookings";
import { DatePicker } from "@/components/common/datePicker";
import { useAuthHooks } from "@/hooks/useAuthHooks";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import { Permissions } from "@/common/types/auth/auth.interface";

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function BookingPage() {
    const { user } = useAuthHooks()
    const isUserAuth = isUserAuthorized(user, [Permissions.ADMIN, Permissions.BOOKING_ADM])
    const [filter, setFilter] = useState<IBookingPageFilter>({
        name: '',
        contact_number: '',
        status: ['confirmed', 'unconfirmed', 'arrived', 'canceled', 'not_shown', 'walk_in'],
        orderBy: 'amount_of_people/desc'
    })

    const {
        restaurantBookingPageData: bookingPage,
        GETRestaurantDataParams: bookingPageParams,
        setGETRestaurantDataParams: setBookingPageParams,
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
        isCreateRestaurantDataLoading: isCreateBookingLoading
    } = usePOSTRestaurantDataHooks({
        query: 'BOOKINGS',
    })

    const {
        updateRestaurantData: updateBooking,
        isUpdateRestaurantDataLoading: isUpdateBookingLoading
    } = usePUTRestaurantDataHooks({
        query: 'BOOKINGS',
    })

    const {
        deleteRestaurantData: deleteBooking,
        isDeleteRestaurantDataLoading: isDeleteBookingLoading
    } = useDELETERestaurantDataHooks({
        query: 'BOOKINGS',
    })

    const {
        updateRestaurantData: updateTimesOpen,
    } = usePUTRestaurantDataHooks({
        query: 'TIMES_OPEN',
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

    return (
        <LayoutFrame
            user={user}
            navigation={{
                content: (
                    <div className='flex-col-container'>
                        <DatePicker
                            onConfirm={(date) => setBookingPageParams(prev => ({
                                openDays: {
                                    bookingPage: {
                                        short_day: formatDate({
                                            date: new Date(date!),
                                            f: 'ccc'
                                        }),
                                        date: new Date(date!),
                                    }
                                }
                            }))}
                            value={bookingPageParams?.openDays?.bookingPage?.date as Date || new Date()}
                            disabled={!isUserAuth}
                        />
                        <WalkinButton
                            times_open={bookingPage?.times_open || []}
                            createBooking={createBooking}
                            clients={clients?.data || []}
                            setGETClientsParams={setGETClientsParams}
                            GETClientsParams={GETClientsParams}
                            sections={bookingPage?.sections_open || []}
                        />
                        <BookingButton
                            createBooking={createBooking}
                            isUserAuth={isUserAuth}
                            isLoading={isCreateBookingLoading}
                        />
                        <FindBooking
                            deleteBooking={deleteBooking}
                            updateBooking={updateBooking}
                            isUserAuth={isUserAuth}
                            isLoading={isUpdateBookingLoading || isDeleteBookingLoading}
                        />
                        <SearchInput
                            placeholder="Name"
                            onSearchChange={e => setFilter(prev => ({
                                ...prev,
                                name: e
                            }) as IBookingPageFilter)}
                            value={filter?.name || ''}
                        />
                        <SearchInput
                            placeholder="Contact Number"
                            onSearchChange={e => setFilter(prev => ({
                                ...prev,
                                contact_number: e
                            }) as IBookingPageFilter)}
                            value={filter?.contact_number || ''}
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
                                            checked={filter?.status?.includes(s?.status)}
                                            onCheckedChange={(checked) => setFilter(prev => {
                                                if (checked) {
                                                    return {
                                                        ...prev,
                                                        status: [
                                                            ...prev?.status,
                                                            s?.status
                                                        ]
                                                    }
                                                } else {
                                                    return {
                                                        ...prev,
                                                        status: prev?.status?.filter(f => f !== s?.status)
                                                    }
                                                }
                                            })}
                                        />
                                    </label>
                                )
                            })}
                        </div>
                        <Select
                            value={filter?.orderBy}
                            onValueChange={(e: string) => setFilter(prev => ({
                                ...prev,
                                orderBy: e
                            }) as IBookingPageFilter)}
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
                        </Select>
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
                                <BookingHeader
                                    day_date={bookingPage?.date}
                                    day_id={bookingPage?.id}
                                    time={time}
                                    updateTimesOpen={updateTimesOpen}
                                />
                                <div className='flex-col-container gap-2 mt-4'>
                                    {bookingPagefilter(filter, time?.bookings?.bookings).map(b => {
                                        return (
                                            <BookingDetails
                                                key={b?.id}
                                                booking={b}
                                                deleteBooking={deleteBooking}
                                                updateBooking={updateBooking}
                                                isUserAuth={isUserAuth}
                                                toTable={{
                                                    timeOpen: time,
                                                    sections: bookingPage?.sections_open || [],
                                                }}
                                                isUpdateBookingLoading={isUpdateBookingLoading || isDeleteBookingLoading}
                                            />
                                        )
                                    })}
                                    {bookingPagefilter(filter, time?.bookings?.canceled_not_shown as unknown as IGETBookingsPageReturn[]).map(b => {
                                        return (
                                            <BookingDetails
                                                key={b?.id}
                                                booking={b as any}
                                                deleteBooking={deleteBooking}
                                                updateBooking={updateBooking}
                                                isUserAuth={isUserAuth}
                                                isUpdateBookingLoading={isUpdateBookingLoading || isDeleteBookingLoading}
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
