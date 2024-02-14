import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

//libs
import { ShiftFormSchema, ShiftFormSchemaType } from "@/common/libs/zod/forms/company/companyShiftForm";
import { convertMinutesToHoursAndMinutes } from "@/common/libs/date-fns/dateFormat";
import { calculateMinTime, shiftFormat } from "./utils";

//components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";


interface CreateShiftFormProps {
    createShift: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    isLoading: boolean
}


export default function CreateShiftForm({ createShift, isLoading }: CreateShiftFormProps) {
    const [toMinTime, setToMinTime] = useState<string>('')
    const form = useForm<ShiftFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(ShiftFormSchema),
        defaultValues: {
            from: '',
            to: '',
            break: 30
        },
    });


    const onSubmitForm: SubmitHandler<ShiftFormSchemaType> = async (formData) => {
        await createShift({
            shift: {
                ...shiftFormat(formData),
                reduce_break_time: true
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
                breakTime: String(form.watch('break'))
            }))
            form.setValue('to', '', { shouldDirty: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('from'), form.watch('break')])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    leftIcon="Plus"
                    size='sm'
                    variant='orange'
                >
                    Shift
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex-col-container w-auto" align="start">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className='flex-col-container w-auto'
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
                            name="break"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Break - Minutes</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            step={1}
                                            {...field}
                                            value={String(field.value)}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch('from') && form.watch('to') && form.watch('break') &&
                            <div className='flex-col-container'>
                                <small>
                                    Shift: {shiftFormat(form.getValues()).title}
                                </small>
                                <small>
                                    Total: {convertMinutesToHoursAndMinutes(shiftFormat(form.getValues()).hours)}
                                </small>
                                <small>
                                    Break: {form.getValues().break} min
                                </small>
                            </div>
                        }

                        <Button
                            type='submit'
                            leftIcon="Plus"
                            size='sm'
                            disabled={isLoading}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}