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
import { VisaDetailsFormSchema, VisaDetailsFormSchemaType } from "@/common/libs/zod/forms/user/visaDetailsForm";
import { cn } from "@/common/libs/shadcn/utils";

interface VisaDetailsFormProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
}

export default function VisaDetailsForm({
    user, isAdmin, onUpdate
}: VisaDetailsFormProps) {
    const [preRendered, setPreRendered] = useState<boolean>(false);

    const form = useForm<VisaDetailsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(VisaDetailsFormSchema),
        defaultValues: {
            visa_number: user?.visa_number || '',
            type_of_visa: user?.type_of_visa || '',
            id_work_authorization: user?.id_work_authorization || '',
        },
    });


    const onSubmitForm: SubmitHandler<VisaDetailsFormSchemaType> = async (formData) => {
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
        return <VisaDetailsForm.Skeleton />;
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'Visa Details',
                    icon: 'CreditCard'
                }
            }}
            // actions={{
            //     toLeft: isAdmin && (
            //         <label className='flex-col-container'>
            //             Visa Needed
            //             <Switch />
            //         </label>
            //     )
            // }}
            className='border-2 rounded-xl p-4'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className='flex-col-container gap-4'
                    >
                    <div className={cn('grid grid-cols-1 gap-4 ', user?.visa_needed ? 'lg:grid-cols-[1fr,1fr,1fr]' : 'grid-cols-1')}>
                        {user?.visa_needed &&
                            <>
                                <FormField
                                    control={form.control}
                                    name="type_of_visa"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type of Visa</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="type_of_visa"
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
                                    name="visa_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Id Number / GNIB Number</FormLabel>
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
                            </>
                        }
                        <FormField
                            control={form.control}
                            name="id_work_authorization"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PPS Number</FormLabel>
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
                    </div>
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


VisaDetailsForm.Skeleton = function SignInformSkeleton() {
    return (
        <Skeleton className='h-full w-full border-2 rounded-xl p-4' />
    )
}
