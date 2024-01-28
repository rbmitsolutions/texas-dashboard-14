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
import { BankDetailsFormSchema, BankDetailsFormSchemaType } from "@/common/libs/zod/forms/user/bankDetailsForm";

interface BankDetailsFormProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
}

export default function BankDetailsForm({
    user, isAdmin, onUpdate
}: BankDetailsFormProps) {
    const [preRendered, setPreRendered] = useState<boolean>(false);

    const form = useForm<BankDetailsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(BankDetailsFormSchema),
        defaultValues: {
            bank: user?.bank,
            iban: user?.iban,
            account_number: user?.account_number,
            bic: user?.bic,
        },
    });


    const onSubmitForm: SubmitHandler<BankDetailsFormSchemaType> = async (formData) => {
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
        return <BankDetailsForm.Skeleton />;
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'Bank Details',
                    icon: 'Landmark'
                }
            }}
            className='border-2 rounded-xl p-4'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className='flex-col-container gap-4'>
                    <FormField
                        control={form.control}
                        name="bank"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Name"
                                        readOnly={isAdmin}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="iban"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Iban</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="IBAN"
                                        readOnly={isAdmin}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="account_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                    <Input
                                        type="tell"
                                        placeholder="Contact Number"
                                        readOnly={isAdmin}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>BIC</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Address"
                                        readOnly={isAdmin}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {!isAdmin &&
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


BankDetailsForm.Skeleton = function SignInformSkeleton() {
    return (
        <Skeleton className='h-full w-full border-2 rounded-xl p-4' />
    )
}
