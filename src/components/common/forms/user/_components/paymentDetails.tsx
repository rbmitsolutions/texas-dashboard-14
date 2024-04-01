import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseMutateFunction } from "react-query"
import { useEffect, useState } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IUser } from "@/common/types/user/user.interface"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import Wrap from "@/components/common/wrap"

//libs

//interfaces
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"
import { cn } from "@/common/libs/shadcn/utils";
import { PaymentDetailsFormSchema, PaymentDetailsFormSchemaType } from "@/common/libs/zod/forms/user/paymentDetailsForm";
import { Switch } from "@/components/ui/switch";

interface PaymentDetailsProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
}

export default function PaymentDetails({
    user, isAdmin, onUpdate
}: PaymentDetailsProps) {
    const [preRendered, setPreRendered] = useState<boolean>(false);

    const form = useForm<PaymentDetailsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(PaymentDetailsFormSchema),
        defaultValues: {
            fixed_salary: user?.fixed_salary || false,
            salary: user?.salary || 0,
            rate_per_hour: user?.rate_per_hour || 0,
            rate_per_hour_weekend: user?.rate_per_hour_weekend || 0,
            payment_id: user?.payment_id || '',
        },
    });


    const onSubmitForm: SubmitHandler<PaymentDetailsFormSchemaType> = async (formData) => {
        await onUpdate({
            details: {
                id: user?.id,
                ...formData
            }
        })
    };


    useEffect(() => {
        setPreRendered(true);
    }, [])


    if (!preRendered || !user) {
        return <PaymentDetails.Skeleton />;
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'Payment Details',
                    icon: 'PiggyBank'
                }
            }}
            className='border-2 rounded-xl p-4'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className='flex-col-container gap-4'
                >
                    <FormField
                        control={form.control}
                        name="fixed_salary"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between w-40 rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Fixed Salary</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className={cn('grid grid-cols-1 gap-4 ', user?.visa_needed ? 'lg:grid-cols-[1fr,1fr,1fr]' : 'grid-cols-1')}>
                        <FormField
                            control={form.control}
                            name="payment_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Id</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder="Payment Id"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            form.watch('fixed_salary') ?
                                <>
                                    <FormField
                                        control={form.control}
                                        name="salary"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Salary</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        placeholder="Salary"
                                                        {...field}
                                                        value={String(field.value)}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                                :
                                <>
                                    <FormField
                                        control={form.control}
                                        name="rate_per_hour"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rate Per Hour</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        placeholder="Salary"
                                                        {...field}
                                                        value={String(field.value)}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rate_per_hour_weekend"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rate Per Hour Weekend</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        placeholder="Salary"
                                                        {...field}
                                                        value={String(field.value)}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                        }
                    </div>
                    {isAdmin &&
                        <Button
                            leftIcon='Save'
                            type='submit'
                            className='self-end'
                        >
                            Save
                        </Button>
                    }
                </form>
            </Form>
        </Wrap>
    )
}


PaymentDetails.Skeleton = function SignInformSkeleton() {
    return (
        <Skeleton className='h-full w-full border-2 rounded-xl p-4' />
    )
}
