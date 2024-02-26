import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

//libs
import { calculateMinTime } from "../../../hrsystem/shifts/_components/utils";
import { convertTime } from "./utils";

//components
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IBookingDays, ISpecialDays } from "@/common/types/restaurant/config.interface";
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { TimesOpenSchema, TimesOpenSchemaType } from "@/common/libs/zod/forms/restaurant/createTimeOpenForm";

interface CreateTimeOpenFormProps {
    openDays: IBookingDays[]
    isLoading: boolean,
    createTimesOpen: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
}


export default function CreateTimeOpenForm({ createTimesOpen, isLoading, openDays }: CreateTimeOpenFormProps) {
    const [isOpen, setOpen] = useState(false)
    const [toMinTime, setToMinTime] = useState<string>('')
    const handleOpenChange = () => {
        setOpen(!isOpen)
        form.reset()
    }

    const form = useForm<TimesOpenSchemaType>({
        mode: "onChange",
        resolver: zodResolver(TimesOpenSchema),
        defaultValues: {
            from: '',
            to: '',
            days_ids: []
        },
    });


    const onSubmitForm: SubmitHandler<TimesOpenSchemaType> = async (formData) => {
        await createTimesOpen({
            timesOpen: {
                open: formData?.from,
                close: formData?.to,
                real_time: formData?.from,
                title: convertTime(formData?.from) + ' TO ' + convertTime(formData?.to),
                days_ids: formData?.days_ids,
                base: true
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    }

    useEffect(() => {
        if (form.watch('from') !== '') {
            setToMinTime(calculateMinTime({
                from: form.watch('from'),
                breakTime: '0'
            }))
            form.setValue('to', '', { shouldDirty: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('from')])

    return (
        <Dialog
            onOpenChange={handleOpenChange}
            open={isOpen}
        >
            <DialogTrigger asChild>
                <Button
                    leftIcon="Plus"
                    size='sm'
                    variant='orange'
                >
                    Time Open
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Create Time Open</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="flex-col-container gap-6"
                        onSubmit={form.handleSubmit(onSubmitForm)}
                    >
                        <FormField
                            control={form.control}
                            name="from"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='time'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="to"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='time'
                                            min={toMinTime}
                                            max='23:59'
                                            disabled={form.watch('from') === ''}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="days_ids"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Days</FormLabel>
                                    </div>
                                    <div className='flex-col-container'>
                                        {openDays?.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="days_ids"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(String(item?.id))}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field?.value, String(item?.id)])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== String(item?.id)
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal">
                                                                {item?.day}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex-container justify-end w-full'>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" size='sm'>
                                    Close
                                </Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                leftIcon='Plus'
                                size='sm'
                                disabled={isLoading}
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}