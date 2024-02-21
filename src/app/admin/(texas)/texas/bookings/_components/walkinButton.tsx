import { Dispatch, SetStateAction, useState } from "react";
import { UseMutateFunction } from "react-query";
import Icon from "@/common/libs/lucida-icon";
import { cn } from "@/common/libs/shadcn/utils";
import validator from "validator";

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { findCurrentTimeSlot, getBookingAmountPerTable } from "./utils";
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";

//interfaces
import { CreateBookingFormSchemaType } from "@/common/libs/zod/forms/restaurant/createBookingForm";
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { IGETBookingPageTimesOpenReturn, IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IClient } from "@/common/types/restaurant/client.interface";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";
import { SocketIoEvent } from "@/common/libs/socketIo/types";

interface WalkinButtonProps {
    iconOnly?: boolean;
    times_open: IGETBookingPageTimesOpenReturn[]
    createBooking: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    clients: IClient[],
    setGETClientsParams: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
    GETClientsParams: IGETRestaurantDataQuery
}


export default function WalkinButton({ times_open, iconOnly, createBooking, clients, setGETClientsParams, GETClientsParams }: WalkinButtonProps): JSX.Element {
    const { emit } = useSocketIoHooks()
    const [isOpen, setIsOpen] = useState(false)
    const [currentTimeSlot, setCurrentTimeSlot] = useState<IGETBookingPageTimesOpenReturn | null>(null);
    const [booking, setBooking] = useState<CreateBookingFormSchemaType>({
        date: new Date(),
        amount_of_people: 2,
        time: '',
        request: '',
        name: '',
        surname: '',
        contact_number: '',
        email: '',
        table_id: ''
    })

    const cleanUserDetailsForm = () => {
        setBooking(prev => ({
            ...prev,
            name: '',
            surname: '',
            contact_number: '',
            email: ''
        }))
    }

    const onOpenChange = (open: boolean) => {
        if (!open) {
            setBooking({
                date: new Date(),
                amount_of_people: 2,
                time: '',
                request: '',
                name: '',
                surname: '',
                contact_number: '',
                email: '',
                table_id: ''
            })
        } else {
            const currentTimeSlot = findCurrentTimeSlot(times_open)
            if (currentTimeSlot) {
                setCurrentTimeSlot({
                    ...currentTimeSlot,
                    tables_available: {
                        ...currentTimeSlot.tables_available,
                        spare: currentTimeSlot?.tables_available?.spare?.filter(t => t.guests === getBookingAmountPerTable(booking?.amount_of_people) && !t?.is_open)
                    }
                })
                setBooking(prev => ({
                    ...prev,
                    time: currentTimeSlot.time
                }))
            }
        }
        setIsOpen(open)
    }

    const onAmountOfPeopleChange = (amount_of_people: number) => {
        const currentTimeSlot = findCurrentTimeSlot(times_open)
        if (currentTimeSlot) {
            setCurrentTimeSlot({
                ...currentTimeSlot,
                tables_available: {
                    ...currentTimeSlot.tables_available,
                    spare: currentTimeSlot?.tables_available?.spare?.filter(t => t.guests === getBookingAmountPerTable(amount_of_people) && !t?.is_open)
                }
            })
        }
        setBooking(prev => ({
            ...prev,
            amount_of_people
        }))
    }

    const onBookingCreate = async (formData: CreateBookingFormSchemaType) => {
        await createBooking({
            booking: {
                ...formData,
                date: new Date(formData.date),
                status: 'walk_in',
                valid_number: formData?.contact_number ? validator.isMobilePhone(formData?.contact_number, ["en-IE"]) : false,
                email: formData?.email ? formData?.email : "walkin@walkin.com",
                contact_number: formData?.contact_number ? formData?.contact_number : '00000',
                table_id: formData?.table_id ? formData?.table_id : undefined,
            }
        }, {
            onSuccess: () => {
                emit({
                    event: SocketIoEvent.BOOKING
                })
                onOpenChange(false)
            }
        })

    };


    return (
        <Sheet
            onOpenChange={(open) => onOpenChange(open)}
            open={isOpen}
        >
            <SheetTrigger asChild>
                {iconOnly ?
                    <Button
                        variant='pink'
                        className='h-4 w-full'
                    >
                        <Icon name='Footprints' />
                    </Button>
                    :
                    <Button
                        leftIcon='Footprints'
                        variant='pink'
                        className='h-20 w-full'
                    >
                        Walk In
                    </Button>
                }
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle>{currentTimeSlot?.time}</SheetTitle>
                </SheetHeader>
                <div className='flex-col-container gap-6 overflow-auto'>
                    <div className='grid grid-cols-4 gap-2'>
                        {[1, 2, 3, 4, 5, 6, 7, 8]?.map(p => {
                            return (
                                <Button
                                    key={p}
                                    variant={booking?.amount_of_people === p ? 'default' : 'outline'}
                                    onClick={() => onAmountOfPeopleChange(p)}
                                >
                                    {p}
                                </Button>
                            )
                        })}
                    </div>
                    <SearchInput
                        onSearchChange={(e) => {
                            setGETClientsParams(prev => ({
                                clients: {
                                    all: {
                                        ...prev?.clients?.all,
                                        pagination: {
                                            take: 20,
                                            skip: 0
                                        },
                                        contact_number: e
                                    }
                                }
                            }))
                            setBooking(prev => ({
                                ...prev,
                                name: '',
                                surname: '',
                                email: '',
                                contact_number: e
                            }))
                        }}
                        cleanSearch={() => cleanUserDetailsForm()}
                        value={GETClientsParams?.clients?.all?.contact_number || booking?.contact_number || ''}
                        placeholder="Search by contact number"
                    />

                    {clients?.length === 0 ? <div className='flex justify-center items-center min-h-44 max-h-44 bg-background-soft'>No clients found</div>
                        :
                        <div className='flex-col-container overflow-auto p-2 min-h-52 max-h-52 scrollbar-thin bg-background-soft'>

                            {clients?.map(client => {
                                return (
                                    <div
                                        key={client?.id}
                                        className={cn('flex-col-container gap-1 p-2 rounded-lg border-2', booking?.email === client?.email ? 'bg-background-soft border-primary' : 'bg-background')}
                                        onClick={() => {
                                            if (booking?.email === client?.email) {
                                                cleanUserDetailsForm()
                                            } else {
                                                setBooking(prev => ({
                                                    ...prev,
                                                    name: client?.name.trim().split(/\s+/)[0] || '',
                                                    surname: client?.name.trim().split(/\s+/).slice(1).join(' ') || '',
                                                    contact_number: client?.contact_number,
                                                    email: client?.email
                                                }))
                                            }
                                        }}
                                    >
                                        <small className='capitalize line-clamp-1'>
                                            {client?.name?.toLocaleLowerCase()}
                                        </small>
                                        <small className='line-clamp-1'>
                                            {client?.email}
                                        </small>
                                        <small className='line-clamp-1'>
                                            {client?.contact_number}
                                        </small>
                                    </div>
                                )
                            })}
                        </div>
                    }

                    {
                        currentTimeSlot?.tables_available?.spare?.length === 0 ? <div className='flex justify-center items-center h-full w-full bg-background-soft'>No Tables  for {booking?.amount_of_people} people Available</div>
                            :
                            <div className='grid grid-cols-2 gap-2 p-2 rounded-lg bg-background-soft overflow-auto scrollbar-thin'>
                                {currentTimeSlot?.tables_available?.spare?.map(table => {
                                    return (
                                        <div
                                            key={table?.id}
                                            className={cn('flex-col-container items-center justify-center p-2 rounded-lg border-2 gap-1 min-h-20', booking?.table_id === table?.id ? 'bg-background-soft border-primary' : 'bg-background')}
                                            onClick={() => {
                                                if (booking?.table_id === table?.id) {
                                                    setBooking(prev => ({
                                                        ...prev,
                                                        table_id: ''
                                                    }))
                                                } else {
                                                    setBooking(prev => ({
                                                        ...prev,
                                                        table_id: table?.id
                                                    }))
                                                }
                                            }}
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
                    }

                </div>
                <SheetFooter>
                    <Button
                        leftIcon="Footprints"
                        className='h-16 min-h-16 mb-8 w-full'
                        variant='pink'
                        onClick={() => onBookingCreate(booking)}
                        disabled={currentTimeSlot?.tables_available?.spare?.length === 0 || !currentTimeSlot}
                    >
                        Walk in
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}