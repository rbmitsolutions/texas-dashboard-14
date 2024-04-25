import { useEffect } from "react";
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
    const form = useForm<CreateSupplierAutoOrderTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierAutoOrderTypeFormSchema),
        defaultValues: {
            week_day: 'Monday',
            email: ''
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
                week_day: update?.auto_order.week_day,
                email: update?.auto_order.email
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