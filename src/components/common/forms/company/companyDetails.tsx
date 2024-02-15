import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CompanyDetailsFormSchema, CompanyDetailsFormSchemaType } from "@/common/libs/zod/forms/company/companyDetailsForm";

//components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrap from "../../wrap";

//interfaces
import { ICompanyDetails } from "@/common/types/company/companyDetails.interface"

//hooks
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";

interface CompanyDetailsFormProps {
    details: ICompanyDetails
    onUpdate?: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export default function CompanyDetailsForm({ details, onUpdate }: CompanyDetailsFormProps) {
    const [submitError, setSubmitError] = useState<string>("");

    const form = useForm<CompanyDetailsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CompanyDetailsFormSchema),
        defaultValues: {
            name: details?.name,
            email: details?.email,
            contact_number: details?.contact_number,
            address: details?.address,
        },
    });

    const onSubmitForm: SubmitHandler<CompanyDetailsFormSchemaType> = async (formData) => {
        onUpdate && await onUpdate({
            info: {
                id: details.id,
                ...formData
            }
        })
    };

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Building2',
                    title: 'Details'
                }
            }}
            className="border-2 p-4 rounded-xl"
        >
            <Form {...form}>
                <form
                    onChange={() => submitError && setSubmitError("")}
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className='flex-col-container'
                >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name="name"
                            defaultValue={details?.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="000 0000000" type='tel' {...field} />
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
                                        <Input placeholder="Email" type='email' {...field} />
                                    </FormControl>
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
                                        <Input placeholder="Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {onUpdate &&
                        <Button
                            type='submit'
                            className='self-end'
                            leftIcon="Save"
                        >
                            Save
                        </Button>
                    }
                </form>
            </Form>
        </Wrap>
    )
}