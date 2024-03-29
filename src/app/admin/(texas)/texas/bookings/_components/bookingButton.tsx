import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";
import { CalendarIcon } from "lucide-react";
import validator from "validator";

//libs
import { useDebounce } from "@/common/utils/useDebouce";

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/common/libs/lucida-icon";


//libs
import { CreateBookingFormSchema, CreateBookingFormSchemaType } from "@/common/libs/zod/forms/restaurant/createBookingForm";
import { BOOKING_PEOPLE, BOOKING_PEOPLE_AUTH } from "@/common/libs/restaurant/bookings";
import { dateFormatIso, formatDate } from "@/common/libs/date-fns/dateFormat";
import { cn } from "@/common/libs/shadcn/utils";

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { SocketIoEvent } from "@/common/libs/socketIo/types";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { IBookings } from "@/common/types/restaurant/bookings.interface";
import { IClient } from "@/common/types/restaurant/client.interface";
interface BookingButtonProps {
    iconOnly?: boolean;
    booking?: {
        data: IBookings
        updateBooking: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
        children: React.ReactNode
    }
    createBooking?: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    isUserAuth: boolean
    isLoading: boolean
    clients: IClient[],
    setGETClientsParams: Dispatch<SetStateAction<IGETRestaurantDataQuery>>,
}

export default function BookingButton({ iconOnly, isLoading, booking, isUserAuth, createBooking, clients, setGETClientsParams }: BookingButtonProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false)
    const { emit } = useSocketIoHooks()

    const form = useForm<CreateBookingFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateBookingFormSchema),
        defaultValues: {
            date: new Date(),
            amount_of_people: 2,
            time: '',
            request: '',
            name: '',
            surname: '',
            contact_number: '',
            email: '',
        },
    });

    const handleOpenChange = () => {
        setIsOpen(!isOpen)
        form.reset()
    }

    const handleUpdateClientForm = (client: IClient) => {
        if (form.watch('contact_number') === client?.contact_number) {
            form.setValue('contact_number', '')
            form.setValue('name', '')
            form.setValue('surname', '')
            form.setValue('email', '')
            return
        } else {
            form.setValue('contact_number', client?.contact_number)
            form.setValue('name', client?.name)
            form.setValue('email', client?.email)
            form.setValue('surname', client?.name)
        }
    }

    const {
        restaurantOpenDay: openDays,
        setGETRestaurantDataParams: setGETOpenDaysParams,
    } = useGETRestaurantDataHooks({
        query: 'OPEN_DAYS',
        defaultParams: {
            openDays: {
                byShortDay: {
                    short_day: formatDate({
                        date: booking ? dateFormatIso(booking?.data?.date) : dateFormatIso(new Date()),
                        f: 'ccc'
                    }),
                    date: booking ? dateFormatIso(booking?.data?.date) : dateFormatIso(new Date())
                }
            }
        },
        UseQueryOptions: {
            enabled: isOpen
        }
    })

    const {
        restaurantWebsiteTimeConfig: websiteTimeConfig,
        setGETRestaurantDataParams: setGETWebsiteTimeConfigParams,
    } = useGETRestaurantDataHooks({
        query: 'TIMES_OPEN',
        defaultParams: {
            times_open: {
                websiteConfig: {
                    date: form.watch("date") && dateFormatIso(form.watch("date")) || dateFormatIso(form.watch('date')),
                    amount_per_table: form.watch("amount_of_people") || 2
                }
            }
        },
        UseQueryOptions: {
            enabled: isOpen
        }
    })


    const onSubmitForm: SubmitHandler<CreateBookingFormSchemaType> = async (formData) => {
        createBooking && await createBooking({
            booking: {
                ...formData,
                name: formData?.name + ' ' + formData?.surname,
                status: 'confirmed',
                valid_number: validator.isMobilePhone(formData?.contact_number, ["en-IE"]),
                amount_of_people: formData.amount_of_people,
                date: dateFormatIso(formData.date),
            }
        }, {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.BOOKING,
                })
                handleOpenChange()
            }
        })

        if (booking?.updateBooking) {
            await booking.updateBooking({
                booking: {
                    ...formData,
                    date: dateFormatIso(formData.date),
                    id: booking?.data?.id,
                    status: 'confirmed'
                }
            }, {
                onSuccess: async () => {
                    await emit({
                        event: SocketIoEvent.BOOKING,
                    })
                    handleOpenChange()
                }
            })
        }


    };

    const searchForUser = useDebounce(() => {
        setGETClientsParams((prev) => ({
            clients: {
                all: {
                    ...prev?.clients?.all,
                    contact_number: form.watch('contact_number'),
                    pagination: {
                        take: 1,
                        skip: 0
                    }
                }
            }
        }))
    }, 500)

    useEffect(() => {
        if (isUserAuth && form?.watch('date') && form?.watch('amount_of_people')) {
            setGETOpenDaysParams({
                openDays: {
                    byShortDay: {
                        short_day: formatDate({
                            date: new Date(form?.watch('date')),
                            f: 'ccc'
                        }),
                        date: dateFormatIso(form?.watch('date'))
                    }
                }

            })
        } else if (form?.watch('date') && form?.watch('amount_of_people')) {
            setGETWebsiteTimeConfigParams({
                times_open: {
                    websiteConfig: {
                        date: dateFormatIso(form?.watch('date')),
                        amount_per_table: form?.watch('amount_of_people')
                    }
                }
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form?.watch('date'), form?.watch('amount_of_people'),])

    useEffect(() => {
        if (booking) {
            form.reset({
                amount_of_people: booking?.data?.amount_of_people,
                date: dateFormatIso(booking?.data?.date),
                time: booking?.data?.time,
                request: booking?.data?.request,
                name: booking?.data?.client?.name.trim().split(/\s+/)[0] || '',
                surname: booking?.data?.client?.name.trim().split(/\s+/).slice(1).join(' ') || '',
                contact_number: booking?.data?.client?.contact_number || '',
                email: booking?.data?.client?.email || '',
            })
        }
    }, [booking, form])


    useEffect(() => {
        searchForUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('contact_number')])

    return (
        <Sheet
            onOpenChange={handleOpenChange}
            open={isOpen}
        >
            <SheetTrigger asChild>
                {booking ?
                    booking?.children
                    :
                    iconOnly ?
                        <Button
                            variant='yellow'
                            className='h-20 w-full'
                        >
                            <Icon name='CalendarDays' />
                        </Button>
                        :
                        <Button
                            leftIcon='CalendarDays'
                            variant='yellow'
                            className='h-20 w-full'
                        >
                            Booking
                        </Button>
                }
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle>New Booking</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className='flex-col-container overflow-auto'
                    >
                        <FormField
                            control={form.control}
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Contact Number"
                                            type='tel'{...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex-col-container gap-4 min-h-24 overflow-auto scrollbar-thin'>
                            {clients?.length === 0 && <div>No clients found</div>}
                            {clients?.map(client => {
                                return (
                                    <div
                                        key={client?.id}
                                        className={cn('flex-col-container gap-1 p-2 bg-background-soft rounded-lg border-2 cursor-pointer', form.watch('contact_number') === client?.contact_number ? 'border-primary' : 'border-transparent')}
                                        onClick={() => handleUpdateClientForm(client)}
                                    >
                                        <strong className='capitalize line-clamp-1'>{client?.name?.toLocaleLowerCase()}</strong>
                                        <small>{client?.contact_number}</small>
                                        <small>{client?.email}</small>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Surname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Surname" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" type='email'{...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal bg-background-soft",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        formatDate({
                                                            date: field.value
                                                        })
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                fromDate={new Date()}
                                                selected={field.value}
                                                onSelect={(e) => {
                                                    if (e) field.onChange(e)
                                                    form.setValue('time', '')
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="amount_of_people"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guests</FormLabel>
                                        <Select
                                            onValueChange={(e) => field.onChange(Number(e))}
                                            defaultValue={String(field.value)}
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Guests" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isUserAuth
                                                    ?
                                                    BOOKING_PEOPLE_AUTH.map(p => {
                                                        return (
                                                            <SelectItem key={p.id} value={p.label}>
                                                                {p.label}
                                                            </SelectItem>
                                                        )
                                                    })
                                                    :

                                                    BOOKING_PEOPLE.map(p => {
                                                        return (
                                                            <SelectItem key={p.id} value={p.label}>
                                                                {p.label}
                                                            </SelectItem>
                                                        )
                                                    })

                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Time" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isUserAuth
                                                    ?
                                                    openDays?.times_open?.map(time => {
                                                        return (
                                                            <SelectItem
                                                                key={time.id}
                                                                value={time?.title}
                                                            >
                                                                {time?.title}
                                                            </SelectItem>
                                                        )
                                                    })
                                                    :
                                                    websiteTimeConfig?.map(time => {
                                                        return (
                                                            <SelectItem
                                                                key={time.id}
                                                                value={time?.title}
                                                                disabled={time?.disabled}
                                                            >
                                                                {time?.title}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }

                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="request"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requests</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any Requests?"
                                            className="resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            leftIcon="CalendarDays"
                            className='h-16 min-h-16 mb-8'
                            variant={booking ? 'green' : 'yellow'}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {booking ? 'Update Booking' : 'Create Booking'}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}









// import { useEffect, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { UseMutateFunction } from "react-query";
// import { CalendarIcon } from "lucide-react";
// import validator from "validator";

// //components
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Icon from "@/common/libs/lucida-icon";

// //libs
// import { CreateBookingFormSchema, CreateBookingFormSchemaType } from "@/common/libs/zod/forms/restaurant/createBookingForm";
// import { BOOKING_PEOPLE, BOOKING_PEOPLE_AUTH } from "@/common/libs/restaurant/bookings";
// import { dateFormatIso, formatDate } from "@/common/libs/date-fns/dateFormat";
// import { cn } from "@/common/libs/shadcn/utils";

// //hooks
// import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
// import { SocketIoEvent } from "@/common/libs/socketIo/types";
// import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";

// //interfaces
// import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
// import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
// import { IBookings } from "@/common/types/restaurant/bookings.interface";
// interface BookingButtonProps {
//     iconOnly?: boolean;
//     booking?: {
//         data: IBookings
//         updateBooking: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
//         children: React.ReactNode
//     }
//     createBooking?: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
//     isUserAuth: boolean
//     isLoading: boolean
// }

// export default function BookingButton({ iconOnly, isLoading, booking, isUserAuth, createBooking }: BookingButtonProps): JSX.Element {
//     const [isOpen, setIsOpen] = useState(false)
//     const { emit } = useSocketIoHooks()

//     const form = useForm<CreateBookingFormSchemaType>({
//         mode: "onChange",
//         resolver: zodResolver(CreateBookingFormSchema),
//         defaultValues: {
//             date: new Date(),
//             amount_of_people: 2,
//             time: '',
//             request: '',
//             name: '',
//             surname: '',
//             contact_number: '',
//             email: '',
//         },
//     });

//     const handleOpenChange = () => {
//         setIsOpen(!isOpen)
//         form.reset()
//     }

//     const {
//         restaurantOpenDay: openDays,
//         setGETRestaurantDataParams: setGETOpenDaysParams,
//     } = useGETRestaurantDataHooks({
//         query: 'OPEN_DAYS',
//         defaultParams: {
//             openDays: {
//                 byShortDay: {
//                     short_day: formatDate({
//                         date: booking ? dateFormatIso(booking?.data?.date) : dateFormatIso(new Date()),
//                         f: 'ccc'
//                     }),
//                     date: booking ? dateFormatIso(booking?.data?.date) : dateFormatIso(new Date())
//                 }
//             }
//         },
//         UseQueryOptions: {
//             enabled: isOpen
//         }
//     })

//     const {
//         restaurantWebsiteTimeConfig: websiteTimeConfig,
//         setGETRestaurantDataParams: setGETWebsiteTimeConfigParams,
//     } = useGETRestaurantDataHooks({
//         query: 'TIMES_OPEN',
//         defaultParams: {
//             times_open: {
//                 websiteConfig: {
//                     date: form.watch("date") && dateFormatIso(form.watch("date")) || dateFormatIso(form.watch('date')),
//                     amount_per_table: form.watch("amount_of_people") || 2
//                 }
//             }
//         },
//         UseQueryOptions: {
//             enabled: isOpen
//         }
//     })


//     const onSubmitForm: SubmitHandler<CreateBookingFormSchemaType> = async (formData) => {
//         createBooking && await createBooking({
//             booking: {
//                 ...formData,
//                 name: formData?.name + ' ' + formData?.surname,
//                 status: 'confirmed',
//                 valid_number: validator.isMobilePhone(formData?.contact_number, ["en-IE"]),
//                 amount_of_people: formData.amount_of_people,
//                 date: dateFormatIso(formData.date),
//             }
//         }, {
//             onSuccess: async () => {
//                 await emit({
//                     event: SocketIoEvent.BOOKING,
//                 })
//                 handleOpenChange()
//             }
//         })

//         if (booking?.updateBooking) {
//             await booking.updateBooking({
//                 booking: {
//                     ...formData,
//                     date: dateFormatIso(formData.date),
//                     id: booking?.data?.id,
//                     status: 'confirmed'
//                 }
//             }, {
//                 onSuccess: async () => {
//                     await emit({
//                         event: SocketIoEvent.BOOKING,
//                     })
//                     handleOpenChange()
//                 }
//             })
//         }


//     };



//     useEffect(() => {
//         if (isUserAuth && form?.watch('date') && form?.watch('amount_of_people')) {
//             setGETOpenDaysParams({
//                 openDays: {
//                     byShortDay: {
//                         short_day: formatDate({
//                             date: new Date(form?.watch('date')),
//                             f: 'ccc'
//                         }),
//                         date: dateFormatIso(form?.watch('date'))
//                     }
//                 }

//             })
//         } else if (form?.watch('date') && form?.watch('amount_of_people')) {
//             setGETWebsiteTimeConfigParams({
//                 times_open: {
//                     websiteConfig: {
//                         date: dateFormatIso(form?.watch('date')),
//                         amount_per_table: form?.watch('amount_of_people')
//                     }
//                 }
//             })
//         }

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [form?.watch('date'), form?.watch('amount_of_people'),])

//     useEffect(() => {
//         if (booking) {
//             form.reset({
//                 amount_of_people: booking?.data?.amount_of_people,
//                 date: dateFormatIso(booking?.data?.date),
//                 time: booking?.data?.time,
//                 request: booking?.data?.request,
//                 name: booking?.data?.client?.name.trim().split(/\s+/)[0] || '',
//                 surname: booking?.data?.client?.name.trim().split(/\s+/).slice(1).join(' ') || '',
//                 contact_number: booking?.data?.client?.contact_number || '',
//                 email: booking?.data?.client?.email || '',
//             })
//         }
//     }, [booking, form])

//     return (
//         <Sheet
//             onOpenChange={handleOpenChange}
//             open={isOpen}
//         >
//             <SheetTrigger asChild>
//                 {booking ?
//                     booking?.children
//                     :
//                     iconOnly ?
//                         <Button
//                             variant='yellow'
//                             className='h-20 w-full'
//                         >
//                             <Icon name='CalendarDays' />
//                         </Button>
//                         :
//                         <Button
//                             leftIcon='CalendarDays'
//                             variant='yellow'
//                             className='h-20 w-full'
//                         >
//                             Booking
//                         </Button>
//                 }
//             </SheetTrigger>
//             <SheetContent
//                 className="w-[400px] sm:w-[540px]"
//             >
//                 <SheetHeader>
//                     <SheetTitle>New Booking</SheetTitle>
//                 </SheetHeader>
//                 <Form {...form}>
//                     <form
//                         onSubmit={form.handleSubmit(onSubmitForm)}
//                         className='flex-col-container overflow-auto'
//                     >
//                         <FormField
//                             control={form.control}
//                             name="date"
//                             render={({ field }) => (
//                                 <FormItem className="flex flex-col">
//                                     <FormLabel>Date</FormLabel>
//                                     <Popover>
//                                         <PopoverTrigger asChild>
//                                             <FormControl>
//                                                 <Button
//                                                     variant={"outline"}
//                                                     className={cn(
//                                                         "w-full pl-3 text-left font-normal bg-background-soft",
//                                                         !field.value && "text-muted-foreground"
//                                                     )}
//                                                 >
//                                                     {field.value ? (
//                                                         formatDate({
//                                                             date: field.value
//                                                         })
//                                                     ) : (
//                                                         <span>Pick a date</span>
//                                                     )}
//                                                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                                 </Button>
//                                             </FormControl>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-auto p-0" align="start">
//                                             <Calendar
//                                                 mode="single"
//                                                 fromDate={new Date()}
//                                                 selected={field.value}
//                                                 onSelect={(e) => {
//                                                     if (e) field.onChange(e)
//                                                     form.setValue('time', '')
//                                                 }}
//                                                 initialFocus
//                                             />
//                                         </PopoverContent>
//                                     </Popover>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <div className='grid grid-cols-2 gap-4'>
//                             <FormField
//                                 control={form.control}
//                                 name="amount_of_people"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Guests</FormLabel>
//                                         <Select
//                                             onValueChange={(e) => field.onChange(Number(e))}
//                                             defaultValue={String(field.value)}
//                                             value={String(field.value)}
//                                         >
//                                             <FormControl>
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Guests" />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 {isUserAuth
//                                                     ?
//                                                     BOOKING_PEOPLE_AUTH.map(p => {
//                                                         return (
//                                                             <SelectItem key={p.id} value={p.label}>
//                                                                 {p.label}
//                                                             </SelectItem>
//                                                         )
//                                                     })
//                                                     :

//                                                     BOOKING_PEOPLE.map(p => {
//                                                         return (
//                                                             <SelectItem key={p.id} value={p.label}>
//                                                                 {p.label}
//                                                             </SelectItem>
//                                                         )
//                                                     })

//                                                 }
//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="time"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Time</FormLabel>
//                                         <Select
//                                             onValueChange={field.onChange}
//                                             defaultValue={field.value}
//                                             value={field.value}
//                                         >
//                                             <FormControl>
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Time" />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 {isUserAuth
//                                                     ?
//                                                     openDays?.times_open?.map(time => {
//                                                         return (
//                                                             <SelectItem
//                                                                 key={time.id}
//                                                                 value={time?.title}
//                                                             >
//                                                                 {time?.title}
//                                                             </SelectItem>
//                                                         )
//                                                     })
//                                                     :
//                                                     websiteTimeConfig?.map(time => {
//                                                         return (
//                                                             <SelectItem
//                                                                 key={time.id}
//                                                                 value={time?.title}
//                                                                 disabled={time?.disabled}
//                                                             >
//                                                                 {time?.title}
//                                                             </SelectItem>
//                                                         )
//                                                     })
//                                                 }

//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                         <FormField
//                             control={form.control}
//                             name="request"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Requests</FormLabel>
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder="Any Requests?"
//                                             className="resize-none h-36"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <div className='grid grid-cols-2 gap-4'>
//                             <FormField
//                                 control={form.control}
//                                 name="name"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Name</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Name" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="surname"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Surname</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Surname" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                         <FormField
//                             control={form.control}
//                             name="contact_number"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Contact Number</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Contact Number" type='tel'{...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Email</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Email" type='email'{...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button
//                             leftIcon="CalendarDays"
//                             className='h-16 min-h-16 mb-8'
//                             variant={booking ? 'green' : 'yellow'}
//                             isLoading={isLoading}
//                             disabled={isLoading}
//                         >
//                             {booking ? 'Update Booking' : 'Create Booking'}
//                         </Button>
//                     </form>
//                 </Form>
//             </SheetContent>
//         </Sheet>
//     )
// }

