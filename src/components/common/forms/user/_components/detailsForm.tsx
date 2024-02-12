import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseMutateFunction } from "react-query"
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IUser } from "@/common/types/user/user.interface"
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import Wrap from "@/components/common/wrap"

//libs
import { UserDetailsFormSchema, UserDetailsFormSchemaType } from "@/common/libs/zod/forms/user/userDetailsForm"
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { cn } from "@/common/libs/shadcn/utils";

//interfaces
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"
import { Skeleton } from "@/components/ui/skeleton";

interface DetailsFormProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
}
export default function DetailsForm({ user, isAdmin, onUpdate }: DetailsFormProps) {
    const [preRendered, setPreRendered] = useState<boolean>(false);
    const form = useForm<UserDetailsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(UserDetailsFormSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            date_of_birthday: user?.date_of_birthday || new Date(),
            contact_number: user?.contact_number || '',
            shirt_size: user?.shirt_size || '',
            address: user?.address || '',
            city: user?.city || '',
            country: user?.country || '',
        },
    });


    const onSubmitForm: SubmitHandler<UserDetailsFormSchemaType> = async (formData) => {
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
        return <DetailsForm.Skeleton />;
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'Details',
                    icon: 'User'
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={!isAdmin}
                                        type="text"
                                        placeholder="Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly
                                        type="email"
                                        placeholder="Email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date_of_birthday"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild >
                                        <FormControl>
                                            <Button
                                                disabled={isAdmin}
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
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
                                            selected={new Date(field.value)}
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
                        name="contact_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={isAdmin}
                                        type="tell"
                                        placeholder="Contact Number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shirt_size"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shirt Size</FormLabel>
                                <Select disabled={isAdmin} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Shirt Size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="XXS">XXS</SelectItem>
                                        <SelectItem value="XS">XS</SelectItem>
                                        <SelectItem value="S">S</SelectItem>
                                        <SelectItem value="M">M</SelectItem>
                                        <SelectItem value="L">L</SelectItem>
                                        <SelectItem value="XL">XL</SelectItem>
                                        <SelectItem value="XXL">XXL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={isAdmin}
                                        type="text"
                                        placeholder="Address"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={isAdmin}
                                        type="text"
                                        placeholder="City"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={isAdmin}
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

DetailsForm.Skeleton = function SignInformSkeleton() {
    return (
        <Skeleton className='h-full w-full border-2 rounded-xl p-4' />
    )
}
