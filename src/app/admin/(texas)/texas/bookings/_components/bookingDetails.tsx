import { UseMutateFunction } from "react-query";
import { Dispatch, SetStateAction, useState } from "react";

//libs
import { bookingBackgroundColor } from "@/common/libs/restaurant/bookings";
import { formatDate } from "@/common/libs/date-fns/dateFormat";
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
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";

//interface
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { ISection, ITable } from "@/common/types/restaurant/tables.interface";
import { IBookings } from "@/common/types/restaurant/bookings.interface";
import { IClient } from "@/common/types/restaurant/client.interface";
import { RedirectTo } from "@/common/types/routers/endPoints.types";
import { SocketIoEvent } from "@/common/libs/socketIo/types";

interface BookingDetailsProps {
    booking: IBookings
    deleteBooking: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    updateBooking: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    isUserAuth: boolean
    toTable?: {
        sections: ISection[]
    }
    isUpdateBookingLoading: boolean
    clients: IClient[],
    setGETClientsParams: Dispatch<SetStateAction<IGETRestaurantDataQuery>>,
}


export default function BookingDetails({
    booking,
    deleteBooking,
    updateBooking,
    isUserAuth,
    toTable,
    isUpdateBookingLoading,
    clients,
    setGETClientsParams
}: BookingDetailsProps) {
    const { emit } = useSocketIoHooks()
    const [tableSelected, setTableSelected] = useState<ITable | undefined>(booking?.table || undefined)

    const toSetTable = toTable && (booking?.status === 'confirmed' || booking?.status === 'unconfirmed')

    const bgColor = bookingBackgroundColor(booking?.status)

    const onOpenChange = () => {
        setTableSelected(booking?.table || undefined)
    }

    const handleCancelBooking = async (booking: IBookings) => {
        await updateBooking({
            booking: {
                id: booking?.id,
                status: 'canceled',
                date: booking?.date,
                amount_of_people: booking?.amount_of_people,
                time: booking?.time,
            }
        }, {
            onSuccess: async () => {
                await emit({
                    event: [SocketIoEvent.BOOKING],
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
            onSuccess: async () => {
                await emit({
                    event: [SocketIoEvent.BOOKING],
                })
            }
        })
    }

    const handleArriveBooking = async (booking: IBookings, table: ITable | undefined) => {
        if (!table) return
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
                    event: [SocketIoEvent.BOOKING, SocketIoEvent.TABLE],
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
                        <div className='flex justify-between w-full gap-2'>
                            <IconText
                                icon="Dice2"
                                text={tableSelected ? 'Table - ' + tableSelected?.number : 'No Table'}
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
                    <div className='flex-col-container gap-2'>
                        <div className='flex-container'>
                            <IconText
                                icon='CalendarCheck'
                                text={formatDate({
                                    date: booking?.date,
                                    f: 'dd, LLL, yy'
                                })}
                            />
                            <IconText
                                icon='Dice2'
                                text={tableSelected ? 'Table - ' + tableSelected?.number : 'No Table'}
                            />
                        </div>
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
                        <div className='flex-container'>
                            <IconText
                                icon='Phone'
                                text={booking?.client?.contact_number || 'No Contact Number'}
                            />
                            <IconText
                                icon='Mail'
                                text={booking?.client?.email || 'No Email'}
                            />
                        </div>
                    </div>
                    <div className='flex-container justify-between'>
                        {booking?.client?.id ?
                            <LinkButton
                                icon="User"
                                href={RedirectTo.CLIENT_PROFILE + '/' + booking?.client?.id + '/bookings'}
                            />
                            : <div />
                        }
                        <div className="space-x-2">
                            <SendEmail
                                contacts={[{
                                    email: booking?.client?.email || '',
                                    id: booking?.client?.id || '',
                                    name: booking?.client?.name || ''
                                }]}
                            />
                            <SendSms
                                contacts={[{
                                    contact_number: booking?.client?.contact_number || '',
                                    id: booking?.client?.id || '',
                                    name: booking?.client?.name || ''
                                }]}
                            />
                        </div>
                    </div>
                    <Textarea
                        defaultValue={booking?.request || 'No Request'}
                        readOnly
                        className='min-h-20 resize-none'
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
                            clients={clients}
                            setGETClientsParams={setGETClientsParams}
                            isLoading={isUpdateBookingLoading}
                        />
                        <DeleteDialogButton
                            onDelete={() => handleDeleteBooking(booking?.id)}
                            isDisabled={!isUserAuth || booking?.status === 'canceled' || booking?.status === 'arrived'}
                        />
                    </div>
                    {toSetTable &&
                        <SelectTable
                            booking={booking}
                            tableSelected={tableSelected}
                            setTableSelected={setTableSelected}
                            sections={toTable?.sections}
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
                            {!tableSelected ? 'Slect a Table' : tableSelected?.is_open ? `Table - ${tableSelected?.number} Table Is Busy` : `Table - ${tableSelected?.number} is Available`}
                        </Button>
                    </SheetFooter>
                }
            </SheetContent>
        </Sheet>
    )
}