import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

//libs
import { CompanyDetailsFormSchema, CompanyDetailsFormSchemaType } from "@/common/libs/zod/forms/company/companyDetailsForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ICompanyDocuments, ICompanyDetails } from "@/common/types/company/companyDetails.interface"
import { Input } from "@/components/ui/input";

//hooks
import { zodResolver } from "@hookform/resolvers/zod";
import Wrap from "../../wrap";
import { CompanyContactsFormSchema, CompanyContactsFormSchemaType } from "@/common/libs/zod/forms/company/companyContactsForm";
import Document from "./_components/document";

interface CompanyDocumentsFormProps {
    documents: ICompanyDocuments[]
}

export default function CompanyDocumentsForm({ documents }: CompanyDocumentsFormProps) {
    const [submitError, setSubmitError] = useState<string>("");

    // const form = useForm<CompanyDocumentsFormSchemaType>({
    //     mode: "onChange",
    //     resolver: zodResolver(CompanyDocumentsFormSchema),
    //     defaultValues: {
    //         name: contact?.name,
    //         email: contact?.email,
    //         contact_number: contact?.contact_number,
    //         manager_of: contact?.manager_of,
    //     },
    // });

    // const onSubmitForm: SubmitHandler<CompanyDocumentsFormSchemaType> = (formData) => {
    //     console.log(formData)

    // };

    return (
        <Wrap
            header={{
                title: {
                    icon: 'FileText',
                    title: 'Documents'
                }
            }}
            className="border-2 p-4 rounded-xl"
        >
            <div
                className='grid grid-cols-1 gap-4 border-2 p-4 rounded-xl  md:grid-cols-2 lg:grid-cols-4'
            >
                {documents?.map(document => {
                    return <Document key={document?.id} document={document} />
                })}
            </div>
        </Wrap>
    )
}

//todo: add form
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