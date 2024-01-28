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
import { EmergencyContactFormSchema, EmergencyContactFormSchemaType } from "@/common/libs/zod/forms/user/emergencyContactForm";

//interfaces
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"

interface EmergencyContactFormProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
}

export default function EmergencyContactForm({
    user, isAdmin, onUpdate
}: EmergencyContactFormProps) {
    const [preRendered, setPreRendered] = useState<boolean>(false);

    const form = useForm<EmergencyContactFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(EmergencyContactFormSchema),
        defaultValues: {
            emergency_name: user?.emergency_name || '',
            emergency_email: user?.emergency_email || '',
            emergency_contact_number: user?.emergency_contact_number || '',
            emergency_adress: user?.emergency_adress || '',
            emergency_city: user?.emergency_city || '',
            emergency_country: user?.emergency_country || '',
        },
    });


    const onSubmitForm: SubmitHandler<EmergencyContactFormSchemaType> = async (formData) => {
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
        return <EmergencyContactForm.Skeleton />;
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'Emergency Contact',
                    icon: 'Siren'
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
                        name="emergency_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                        name="emergency_email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email"
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
                        name="emergency_contact_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
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
                        name="emergency_adress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="emergency_city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="City"
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
                        name="emergency_country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly
                                        type="text"
                                        placeholder="Country"
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


EmergencyContactForm.Skeleton = function SignInformSkeleton() {
    return (
        <Skeleton className='h-full w-full border-2 rounded-xl p-4' />
    )
}
