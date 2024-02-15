import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//libs
import { CompanyContactsFormSchema, CompanyContactsFormSchemaType } from "@/common/libs/zod/forms/company/companyContactsForm";

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


interface CreateContactFormProps {
    createContact: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    isLoading: boolean
}

export default function CreateContactForm({ createContact, isLoading }: CreateContactFormProps) {

    const form = useForm<CompanyContactsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CompanyContactsFormSchema),
        defaultValues: {
            name: '',
            email: '',
            contact_number: '',
            manager_of: '',
        },
    });

    const onSubmitForm: SubmitHandler<CompanyContactsFormSchemaType> = async (formData) => {
        await createContact({
            contact: {
                ...formData
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    leftIcon="Plus"
                    size='sm'
                    variant='orange'
                >
                    Contact
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
                            name="name"
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
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contact Number" type='tel' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="manager_of"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manager Of</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Manager Of" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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