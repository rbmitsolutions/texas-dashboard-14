import { useState } from "react";

//libs
import { ICompanyContacts } from "@/common/types/company/companyDetails.interface"
import { Input } from "@/components/ui/input";

//hooks
import Wrap from "../../wrap";

interface CompanyContactsFormProps {
    contacts: ICompanyContacts[]
}

//todo add form
export default function CompanyContactsForm({ contacts }: CompanyContactsFormProps) {
    const [submitError, setSubmitError] = useState<string>("");

    // const form = useForm<CompanyContactsFormSchemaType>({
    //     mode: "onChange",
    //     resolver: zodResolver(CompanyContactsFormSchema),
    //     defaultValues: {
    //         name: contact?.name,
    //         email: contact?.email,
    //         contact_number: contact?.contact_number,
    //         manager_of: contact?.manager_of,
    //     },
    // });

    // const onSubmitForm: SubmitHandler<CompanyContactsFormSchemaType> = (formData) => {
    //     console.log(formData)

    // };

    return (
        <Wrap
            header={{
                title: {
                    icon: 'UsersRound',
                    title: 'Contacts'
                }
            }}
            className="border-2 p-4 rounded-xl"
        >
            {contacts?.map(contact => {
                return (
                    <div
                        key={contact?.id}
                        className='grid grid-cols-1 gap-4 md:grid-cols-2 border-2 p-4 rounded-xl'
                    >
                        <div className='space-y-2'>
                            <label>Name</label>
                            <Input type="text" value={contact?.name} />
                        </div>
                        <div className='space-y-2'>
                            <label>Contact Number</label>
                            <Input type="text" value={contact?.contact_number} />
                        </div>
                        <div className='space-y-2'>
                            <label>Email</label>
                            <Input type="text" value={contact?.email} />
                        </div>
                        <div className='space-y-2'>
                            <label>Manager Of</label>
                            <Input type="text" value={contact?.manager_of} />
                        </div>

                    </div>
                )
            })}
        </Wrap>
    )
}

{/* <Form {...form}>
    <form
        onChange={() => submitError && setSubmitError("")}
        onSubmit={form.handleSubmit(onSubmitForm)}
        className='grid grid-cols-1 gap-4 md:grid-cols-2'
    >
        <FormField
            control={form.control}
            name="name"
            defaultValue={contact?.name}
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
            name="manager_of"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Manager Of</FormLabel>
                    <FormControl>
                        <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

    </form>
</Form> */}