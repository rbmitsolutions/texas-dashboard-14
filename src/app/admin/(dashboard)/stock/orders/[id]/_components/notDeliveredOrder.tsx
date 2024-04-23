import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UseMutateFunction } from "react-query";
import { CalendarIcon } from "lucide-react";

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { cn } from "@/common/libs/shadcn/utils";

//compoents
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

//interface
import { DeliveryOrderFormSchema, DeliveryOrderFormSchemaType, DeliveryVehicle, PackagingOptions, numbersArray, temperatureArray } from "@/common/libs/zod/forms/stock/deliveOrderForm";
import { IStockOrders, IStockSuppliers } from "@/common/types/restaurant/stock.interface"
import { IPOSTFormDataBody } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";
import { IToken } from "@/common/types/auth/auth.interface";
import { Input } from "@/components/ui/input";

interface NotDeliveredOrderProps {
    supplier: IStockSuppliers
    order: IStockOrders
    user: IToken
    updateOrder: UseMutateFunction<any, any, IPUTStockBody, unknown>
}

export default function NotDeliveredOrder({ supplier, order, user, updateOrder }: NotDeliveredOrderProps) {
    const [submitError, setSubmitError] = useState("");

    const form = useForm<DeliveryOrderFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(DeliveryOrderFormSchema),
        defaultValues: {
            quantity: order?.product_quantity,
            packaging: PackagingOptions.Normal,
            delivery_vehicle: DeliveryVehicle.Normal,
            good_until: undefined,
            batch_number: '',
            temperature: 0
        },
    });

    const onSubmitForm: SubmitHandler<DeliveryOrderFormSchemaType> = async (formData) => {
        let haccpValues: any[] = [
            {
                type: "input",
                label: "Supplier",
                propsUi: {
                    value: supplier?.title,
                    isReadOnly: true
                },
                register: "supplier",
                required: true,
                supplier: supplier?.title,
                description: ""
            },
            {
                type: "input",
                label: "Packaging",
                propsUi: {
                    value: formData?.packaging || '',
                    isReadOnly: true
                },
                register: "packaging",
                required: true,
                packaging: formData?.packaging,
                description: ""
            },
            {
                type: "input",
                label: "Delivery Vehicle & Person",
                propsUi: {
                    value: formData?.delivery_vehicle,
                    isReadOnly: true
                },
                register: "delivery_vehicle_person",
                required: true,
                description: "",
                delivery_vehicle_person: formData?.delivery_vehicle
            },
            {
                type: "input",
                label: "Delivery Product",
                propsUi: {
                    value: order?.product?.title,
                    isReadOnly: true
                },
                register: "delivery_product",
                required: true,
                description: '',
                delivery_product: order?.product?.title
            },

        ]

        if (formData?.good_until) {
            haccpValues.push({
                type: "input",
                label: "Good Until",
                propsUi: {
                    value: formatDate({
                        date: formData?.good_until,
                        f: 'yyyy-MM-dd'
                    }),
                    isReadOnly: true
                },
                register: "good_until",
                required: true,
                good_until: formatDate({
                    date: formData?.good_until,
                    f: 'yyyy-MM-dd'
                }),
                description: ""
            })
        }

        if (formData?.batch_number) {
            haccpValues.push({
                type: "input",
                label: "Batch Number",
                propsUi: {
                    value: formData?.batch_number,
                    isReadOnly: true
                },
                register: "batch_number",
                required: true,
                description: "",
                batch_number: formData?.batch_number
            })
        }

        if (formData?.temperature) {
            haccpValues.push({
                type: "input",
                label: "Temperature",
                propsUi: {
                    value: String(formData?.temperature),
                    isReadOnly: true
                },
                register: "temperature",
                required: true,
                description: "",
                temperature: String(formData?.temperature)
            },)
        }


        let haccpForm: IPOSTFormDataBody = {
            title: 'Good In Delivery',
            by: user?.name,
            values: [haccpValues] as any
        }

        await updateOrder({
            order: {
                id: order?.id,
                product_quantity: formData?.quantity,
                delivery_date: new Date(),
                haccp: haccpForm
            }
        })
    };


    return (
        <div className='w-full p-4 rounded-md bg-background-soft'>
            <div className='flex-container justify-between mb-4'>
                <strong>
                    {order?.product?.title}
                </strong>
                <DeleteDialogButton
                    onDelete={() => console.log('delete')}
                />
            </div>
            <Form {...form}>
                <form
                    className='flex-col-container gap-4'
                    onChange={() => submitError && setSubmitError("")}
                    onSubmit={form.handleSubmit(onSubmitForm)}>
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <Select
                                    onValueChange={(e => field.onChange(Number(e)))}
                                    defaultValue={String(field.value)}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Quantity" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {numbersArray?.map(q => {
                                            return (
                                                <SelectItem key={q} value={String(q)}>{q}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="packaging"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Packaging</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Packaging Options" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(PackagingOptions).map(o => {
                                            return (
                                                <SelectItem key={o} value={o}>{o}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="delivery_vehicle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Vehicle & Person</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Delivery Vehicle & Person" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(DeliveryVehicle).map(o => {
                                            return (
                                                <SelectItem key={o} value={o}>{o}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="good_until"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Good Until</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate({
                                                        date: field.value,
                                                        f: "PPP",
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
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="batch_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Batch Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Batch Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temperature</FormLabel>
                                <Select
                                    onValueChange={(e => field.onChange(Number(e)))}
                                    defaultValue={String(field.value)}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Temperature" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {temperatureArray?.map(q => {
                                            return (
                                                <SelectItem key={q} value={String(q)}>{q}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        leftIcon='Lock'
                        isLoading={false}
                    >
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    )
}