'use client'
import { useState } from "react";
import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";

//libs
import { SpecialDaysFormSchema, SpecialDaysFormSchemaType } from "@/common/libs/zod/forms/restaurant/createSpecialDayForm";
import { formatDate } from "@/common/libs/date-fns/dateFormat";

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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { ITimesOpen } from "@/common/types/restaurant/config.interface";
import { ISection } from "@/common/types/restaurant/tables.interface";
import { cn } from "@/common/libs/shadcn/utils";

interface CreateSpecialDayFormProps {
    timesOpen: ITimesOpen[]
    isLoading: boolean,
    sections: ISection[],
    createSpecialDay: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
}


export default function CreateSpecialDayForm({ isLoading, sections, timesOpen, createSpecialDay }: CreateSpecialDayFormProps) {
    const [isOpen, setOpen] = useState(false)

    const form = useForm<SpecialDaysFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(SpecialDaysFormSchema),
        defaultValues: {
            date: new Date(),
            is_disabled: false,
            section_ids: [],
            times_open_ids: []
        },
    });

    const handleOpenChange = () => {
        setOpen(!isOpen)
        form.reset()
    }


    const onSubmitForm: SubmitHandler<SpecialDaysFormSchemaType> = async (formData) => {
        await createSpecialDay({
            specialDay: {
                date: new Date(formData.date),
                is_disabled: !formData.is_disabled,
                section_ids: formData.section_ids,
                times_open_ids: formData.times_open_ids
            }
        }, {
            onSuccess: () => {
                handleOpenChange()
            }
        })
    }


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
                        Special Days
                    </Button>
                
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Create</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="flex-col-container gap-6"
                        onSubmit={form.handleSubmit(onSubmitForm)}
                    >
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
                                                        "pl-3 text-left font-normal bg-background-soft",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        formatDate({
                                                            date: field.value,
                                                            f: 'PPP'
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
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                fromDate={new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Your date of birth is used to calculate your age.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form?.watch('date') && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="is_disabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow bg-background-soft">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        form.setValue('section_ids', [])
                                                        form.setValue('times_open_ids', [])
                                                        field.onChange(checked)
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Available for Bookings
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {form.watch('is_disabled') && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="section_ids"
                                            render={() => (
                                                <FormItem>
                                                    <div className="mb-4">
                                                        <FormLabel className="text-base">Sections Open</FormLabel>
                                                    </div>
                                                    <div className='grid grid-cols-4 gap-4'>
                                                        {sections?.map((item) => (
                                                            <FormField
                                                                key={item.id}
                                                                control={form.control}
                                                                name="section_ids"
                                                                render={({ field }) => {
                                                                    return (
                                                                        <FormItem
                                                                            key={item.id}
                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={field.value?.includes(item.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        return checked
                                                                                            ? field.onChange([...field?.value, item.id])
                                                                                            : field.onChange(
                                                                                                field.value?.filter(
                                                                                                    (value) => value !== item.id
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="text-sm font-normal">
                                                                                {item?.title}
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
                                        <FormField
                                            control={form.control}
                                            name="times_open_ids"
                                            render={() => (
                                                <FormItem>
                                                    <div className="mb-4">
                                                        <FormLabel className="text-base">Times Open</FormLabel>
                                                    </div>
                                                    <div className='grid grid-cols-2 gap-4 max-h-60 scrollbar-thin overflow-auto'>
                                                        {timesOpen?.map((item) => (
                                                            <FormField
                                                                key={item.id}
                                                                control={form.control}
                                                                name="times_open_ids"
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
                                                                                {item?.title}
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
                                    </>
                                )}
                            </>
                        )}
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