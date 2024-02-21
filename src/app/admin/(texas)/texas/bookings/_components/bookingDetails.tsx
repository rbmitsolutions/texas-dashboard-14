import { UseMutateFunction } from "react-query";
import { useState } from "react";

//libs
import { bookingBackgroundColor } from "@/common/libs/restaurant/bookings";
import { cn } from "@/common/libs/shadcn/utils";
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
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import LinkButton from "@/components/common/linkButton";
import SendEmail from "@/components/common/sendEmail";
import IconText from "@/components/common/iconText";
import { Textarea } from "@/components/ui/textarea";
import { getBookingAmountPerTable } from "./utils";
import SendSms from "@/components/common/sendSms";
import { Button } from "@/components/ui/button";
import BookingButton from "./bookingButton";

//hooks
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interface
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";
import { IGETBookingPageTimesOpenReturn, IGETBookingsPageReturn, IGETSpareTablesReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { IBookings } from "@/common/types/restaurant/bookings.interface";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import { RedirectTo } from "@/common/types/routers/endPoints.types";
import { Permissions } from "@/common/types/auth/auth.interface";
import { SocketIoEvent } from "@/common/libs/socketIo/types";

interface BookingDetailsProps {
    booking: IGETBookingsPageReturn
    deleteBooking: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    updateBooking: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    times_open?: IGETBookingPageTimesOpenReturn
}
export default function BookingDetails({ booking, deleteBooking, updateBooking, times_open }: BookingDetailsProps) {
    const { user } = useAuthHooks()
    const { emit } = useSocketIoHooks()
    const [gestsFilter, setGestsFilter] = useState([getBookingAmountPerTable(booking?.amount_of_people)])
    const [tableSelected, setTableSelected] = useState<IGETSpareTablesReturn>(booking?.table as unknown as IGETSpareTablesReturn)

    const bgColor = bookingBackgroundColor(booking?.status)

    const onOpenChange = () => {
        setGestsFilter([getBookingAmountPerTable(booking?.amount_of_people)])
        setTableSelected(booking?.table as unknown as IGETSpareTablesReturn)
    }

    const handleCancelBooking = async (booking: IGETBookingsPageReturn) => {
        await updateBooking({
            booking: {
                id: booking?.id,
                status: 'canceled',
                date: booking?.date,
                amount_of_people: booking?.amount_of_people,
                time: booking?.time,
            }
        }, {
            onSuccess: () => {
                emit({
                    event: SocketIoEvent.BOOKING,
                })
            }
        })
    }

    const handleDeleteBooking = async (id: string) => {
        await deleteBooking({
            booking: {
                id
            }
        }, {
            onSuccess: () => {
                emit({
                    event: SocketIoEvent.BOOKING,
                })
            }
        })
    }

    return (
        <Sheet
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                <div className={cn('flex rounded-md p-2 cursor-pointer', bgColor)} >
                    <div className='flex flex-col gap-[3px] w-full justify-center max-w-[105px] line-clamp-1'>
                        <div className='flex gap-2'>
                            <IconText
                                icon="Dice2"
                                text={booking?.table ? booking?.table?.section?.title + ' - ' + booking?.table?.number : 'No Table'}
                                className='gap-1'
                                iconSize={12}
                                pclass="text-[10px] font-bold"
                            />
                            <small className='text-[10px] font-bold capitalize'>{booking?.amount_of_people} pp</small>
                            {booking?.has_request &&
                                <Icon
                                    name='Star'
                                    fill="blue"
                                    size={14}
                                    className='text-blue-400'
                                />
                            }
                        </div>
                        <small className='text-[10px] capitalize line-clamp-1'>{booking?.client?.name?.toLowerCase()}</small>
                        <div className='flex gap-2'>
                            {booking?.client?.qnt_of_bookings &&
                                <IconText
                                    icon="CalendarCheck"
                                    text={booking?.client?.qnt_of_bookings || 0}
                                    className='gap-1'
                                    iconSize={10}
                                    pclass="text-[10px]"
                                />
                            }
                            {booking?.client?.restaurant_review &&
                                <IconText
                                    icon="Star"
                                    text={booking?.client?.restaurant_review.toFixed(2) || 0}
                                    className='gap-1'
                                    iconSize={10}
                                    pclass="text-[10px]"
                                />
                            }
                        </div>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle className='capitalize line-clamp-1'>{booking?.client?.name?.toLowerCase()}</SheetTitle>
                </SheetHeader>
                <div className='flex-col-container overflow-auto'>
                    <div className='flex-col-container'>
                        <IconText
                            icon='Dice2'
                            text={tableSelected?.section?.title + ' - ' + tableSelected?.number}
                        />
                        <div className='flex-container'>
                            <IconText
                                icon='Armchair'
                                text={booking?.amount_of_people + ' people'}
                            />
                            <IconText
                                icon='Clock'
                                text={booking?.time}
                            />
                        </div>
                    </div>
                    <div className='flex-container justify-between'>
                        <LinkButton
                            icon="User"
                            href={RedirectTo.CLIENT_PROFILE + '/' + booking?.client?.id + '/bookings'}
                        />
                        <div className="space-x-2">
                            <SendEmail
                                contacts={[{
                                    email: booking?.client?.email,
                                    id: booking?.client?.id,
                                    name: booking?.client?.name
                                }]}
                            />
                            <SendSms
                                contacts={[{
                                    contact_number: booking?.client?.contact_number,
                                    id: booking?.client?.id,
                                    name: booking?.client?.name
                                }]}
                            />
                        </div>
                    </div>
                    <Textarea
                        defaultValue={booking?.request || 'No Request'}
                        readOnly
                        className='min-h-40 resize-none'
                    />
                    <div className='grid grid-cols-[1fr,1fr,auto] items-center gap-4'>
                        <Button
                            size='sm'
                            variant='yellow'
                            leftIcon='XCircle'
                            onClick={() => handleCancelBooking(booking)}
                            disabled={booking?.status === 'canceled'}
                        >
                            Cancel
                        </Button>
                        <BookingButton
                            booking={{
                                data: booking as unknown as IBookings,
                                children: (
                                    <Button
                                        size='sm'
                                        variant='blue'
                                        leftIcon='CalendarDays'
                                        type='button'
                                        disabled={booking?.status === 'arrived' || booking?.status === 'walk_in' || booking?.status === 'canceled'}
                                    >
                                        Update
                                    </Button>
                                ),
                                updateBooking
                            }}
                        />
                        <DeleteDialogButton
                            onDelete={() => handleDeleteBooking(booking?.id)}
                            isDisabled={!isUserAuthorized(
                                user,
                                [Permissions.ADMIN, Permissions.BOOKING_ADM]
                            ) || booking?.status === 'canceled' || booking?.status === 'arrived'}
                        />
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                        {[2, 4, 6, 8]?.map(g => {
                            return (
                                <Button
                                    key={g}
                                    variant={gestsFilter.includes(g) ? 'default' : 'outline'}
                                    onClick={() => {
                                        if (gestsFilter.includes(g)) {
                                            setGestsFilter(prev => prev.filter(f => f !== g))
                                        } else {
                                            setGestsFilter(prev => [...prev, g])
                                        }
                                        setTableSelected(booking?.table as unknown as IGETSpareTablesReturn)
                                    }}
                                    className='h-12'
                                >
                                    {g} pp
                                </Button>
                            )
                        })}
                    </div>
                    <div className='grid grid-cols-2 gap-2 p-2 bg-background-soft scrollbar-thin overflow-auto'>
                        {times_open?.tables_available?.spare?.map(table => {
                            if (gestsFilter.includes(table?.guests) && !table?.is_open)
                                return (
                                    <div
                                        key={table?.id}
                                        className={cn('flex-col-container items-center justify-center p-2 rounded-lg border-2 gap-1 min-h-20 cursor-pointer', tableSelected?.id === table?.id ? 'bg-background-soft border-primary' : 'bg-background')}
                                        onClick={() => setTableSelected(prev => {
                                            if (prev?.id === table?.id) {
                                                return booking?.table as unknown as IGETSpareTablesReturn
                                            } else {
                                                return table
                                            }
                                        })}
                                    >
                                        <small>
                                            {table?.section?.title} - {table?.number}
                                        </small>
                                        <small>
                                            {table?.guests} Guests
                                        </small>
                                    </div>
                                )
                        })}
                    </div>
                </div>
                <SheetFooter>
                    <Button
                        variant={tableSelected?.is_open ? 'destructive' : 'green'}
                        leftIcon="CheckCircle"
                        className='w-full h-14'
                        disabled={tableSelected?.is_open}
                    >
                        {tableSelected?.section?.title + ' - ' + tableSelected?.number} {tableSelected?.is_open ? 'Table Is Busy' : 'Table Available'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}