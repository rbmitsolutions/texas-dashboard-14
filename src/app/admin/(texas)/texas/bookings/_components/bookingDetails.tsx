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
import SendSms from "@/components/common/sendSms";
import { Button } from "@/components/ui/button";
import BookingButton from "./bookingButton";
import SelectTable from "./selectTable";

//hooks
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";

//interface
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";
import { IBookingPageResponse, IGETBookingPageTimesOpenReturn, IGETBookingsPageReturn, IGETSpareTablesReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { IBookings } from "@/common/types/restaurant/bookings.interface";
import { RedirectTo } from "@/common/types/routers/endPoints.types";
import { SocketIoEvent } from "@/common/libs/socketIo/types";

interface BookingDetailsProps {
    booking: IGETBookingsPageReturn
    deleteBooking: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    updateBooking: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    isUserAuth: boolean
    toTable?: {
        timeOpen: IGETBookingPageTimesOpenReturn
        sections: IBookingPageResponse['sections_open']
    }
    isUpdateBookingLoading: boolean
}


export default function BookingDetails({ booking, isUserAuth, deleteBooking, updateBooking, toTable, isUpdateBookingLoading }: BookingDetailsProps) {
    const { emit } = useSocketIoHooks()
    const [tableSelected, setTableSelected] = useState<IGETSpareTablesReturn>(booking?.table as unknown as IGETSpareTablesReturn)
    const toSetTable = toTable && (booking?.status === 'confirmed' || booking?.status === 'unconfirmed')

    const bgColor = bookingBackgroundColor(booking?.status)

    const onOpenChange = () => {
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

    const handleArriveBooking = async (booking: IGETBookingsPageReturn, table: IGETSpareTablesReturn) => {
        await updateBooking({
            booking: {
                id: booking?.id,
                status: 'arrived',
                date: booking?.date,
                amount_of_people: booking?.amount_of_people,
                time: booking?.time,
                table_id: table?.id
            }
        }, {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.BOOKING,
                })
                await emit({
                    event: SocketIoEvent.TABLE,
                })
            }
        })
    }
    return (
        <Sheet
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                <div className={cn('flex relative rounded-md p-2 cursor-pointer', bgColor)} >
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
                                    className='absolute top-0 right-0 text-blue-400'
                                />
                            }
                        </div>
                        <small className='text-[10px] capitalize line-clamp-1'>{booking?.client?.name?.toLowerCase()}</small>
                        <div className='flex gap-2'>
                            {booking?.client?.qnt_of_bookings! > 0 &&
                                <IconText
                                    icon="CalendarCheck"
                                    text={booking?.client?.qnt_of_bookings || 0}
                                    className='gap-1'
                                    iconSize={10}
                                    pclass="text-[10px]"
                                />
                            }
                            {booking?.client?.restaurant_review! > 0 &&
                                <IconText
                                    icon="Star"
                                    text={booking?.client?.restaurant_review?.toFixed(2) || 0}
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
                            isUserAuth={isUserAuth}
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
                            isLoading={isUpdateBookingLoading}
                        />
                        <DeleteDialogButton
                            onDelete={() => handleDeleteBooking(booking?.id)}
                            isDisabled={!isUserAuth || booking?.status === 'canceled' || booking?.status === 'arrived'}
                        />
                    </div>
                    {toSetTable &&
                        <SelectTable
                            sections={toTable?.sections}
                            booking={booking}
                            tableSelected={tableSelected}
                            setTableSelected={setTableSelected}
                            tables={toTable?.timeOpen?.tables_available?.spare}
                        />
                    }
                </div>
                {toSetTable &&
                    <SheetFooter>
                        <Button
                            variant={tableSelected?.is_open ? 'destructive' : 'green'}
                            leftIcon="CheckCircle"
                            className='w-full h-14'
                            disabled={tableSelected?.is_open || !tableSelected}
                            onClick={() => handleArriveBooking(booking, tableSelected)}
                        >
                            {!tableSelected ? 'Slect a Table' : tableSelected?.is_open ? `${tableSelected?.section?.title} - ${tableSelected?.number} Table Is Busy` : `${tableSelected?.section?.title} - ${tableSelected?.number} is Available`}
                        </Button>
                    </SheetFooter>
                }
            </SheetContent>
        </Sheet>
    )
}