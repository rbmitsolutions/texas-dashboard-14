import { UseMutateFunction } from "react-query";

//libs
import { ICompanyLinks } from "@/common/types/company/companyDetails.interface"

//components
import Links from "./_components/links";
import Wrap from "../../wrap";

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";

interface CompanyLinkFormProps {
    links: ICompanyLinks[]
    deleteLink?: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

//todo add form
export default function CompanyLinkForm({ links, deleteLink }: CompanyLinkFormProps) {
    const linksSection = ['Training', 'Onboarding', 'Requests & Notifications']

    return (
        <div className='flex-col-container'>
            {linksSection?.map(section => {
                return (
                    <Wrap
                        key={section}
                        header={{
                            title: {
                                icon: 'Mouse',
                                title: section
                            }
                        }}
                        className="border-2 p-4 rounded-xl"
                    >
                        <div
                            className='grid grid-cols-1 gap-4 border-2 p-4 rounded-xl  md:grid-cols-2 lg:grid-cols-4'
                        >
                            {links?.map(link => {
                                if (link?.section === section)
                                    return <Links key={link?.id} link={link} deleteLink={deleteLink}/>
                            })}
                        </div>
                    </Wrap>
                )
            })}

        </div>
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