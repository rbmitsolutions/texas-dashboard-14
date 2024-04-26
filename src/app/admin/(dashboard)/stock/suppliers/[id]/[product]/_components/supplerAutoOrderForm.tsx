import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateSupplierAutoOrderTypeFormSchema, CreateSupplierAutoOrderTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createSupplierAutoOrder";

//components
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IStockSupplierAutoOrder } from "@/common/types/restaurant/stock.interface";
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";
import { daysOfWeek } from "@/common/libs/date-fns/dateFormat";
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import Icon from "@/common/libs/lucida-icon";

export interface SupplerAutoOrderFormProps {
    supplier_id: string
    createSupplierAutoOrder?: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
    update?: {
        updateSupplierAutoOrder: UseMutateFunction<any, any, IPUTStockBody, unknown>
        auto_order: IStockSupplierAutoOrder | undefined
    }
}

export default function SupplerAutoOrderForm({
    supplier_id,
    createSupplierAutoOrder,
    update
}: SupplerAutoOrderFormProps) {
    const [email_cc, setEmailCc] = useState<string>('')

    const form = useForm<CreateSupplierAutoOrderTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierAutoOrderTypeFormSchema),
        defaultValues: {
            week_day: 'Monday',
            email: '',
            email_cc: []
        },
    });

    const onSubmitForm: SubmitHandler<CreateSupplierAutoOrderTypeFormSchemaType> = async (formData) => {
        if (update?.updateSupplierAutoOrder && update?.auto_order) {
            await update.updateSupplierAutoOrder({
                auto_order: {
                    id: update?.auto_order?.id,
                    ...formData
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        } else if (createSupplierAutoOrder) {
            await createSupplierAutoOrder({
                auto_order: {
                    ...formData,
                    supplier_id
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }
    };

    useEffect(() => {
        if (update?.auto_order) {
            form.reset({
                week_day: update?.auto_order?.week_day,
                email: update?.auto_order?.email,
                email_cc: update?.auto_order?.email_cc
            })
        }
    }, [form, update])


    return (
        <div>
            <strong className="text-primary">Auto Order</strong>
            <Form {...form} >
                <form
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className="flex-col-container"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="email"
                                        type='email'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="week_day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Week Day</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Week Day" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {daysOfWeek.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    What day of the week do you want to order?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.watch('email_cc')?.map((email, index) => {
                        return (
                            <div key={index} className='flex-container justify-between items-center p-2 rounded-md bg-background-soft'>
                                <small>{email} </small>
                                <DeleteDialogButton
                                    onDelete={async () => {
                                        form.setValue('email_cc', form.watch('email_cc')?.filter((_, i) => i !== index))
                                        await onSubmitForm(form.getValues())
                                    }}
                                />
                            </div>
                        )
                    })}

                    <div className='flex-container justify-between p-1 items-center'>
                        <Input
                            placeholder="CC Email"
                            type='email'
                            value={email_cc}
                            onChange={(e) => setEmailCc(e.target.value)}
                        />
                        <Button
                            type='button'
                            size='iconExSm'
                            onClick={async () => {
                                form.setValue('email_cc', [...form.getValues('email_cc'), email_cc])
                                setEmailCc('')
                                await onSubmitForm(form.getValues())
                            }}
                        >
                            <Icon name='Plus' />
                        </Button>
                    </div>

                    <Button
                        variant='blue'
                        leftIcon='Save'
                        className='self-end'
                    >
                        Save
                    </Button>
                </form>
            </Form >
        </div >
    )
}