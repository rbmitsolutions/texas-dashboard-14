import { useState } from "react";
import { UseMutateFunction } from "react-query";

//libs
import { ICompanyContacts } from "@/common/types/company/companyDetails.interface"
import { Input } from "@/components/ui/input";

//components
import { Button } from "@/components/ui/button";
import Icon from "@/common/libs/lucida-icon";
import Wrap from "../../wrap";

//interfaces
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";

interface CompanyContactsFormProps {
    contacts: ICompanyContacts[]
    onDelete?: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

//todo add form
export default function CompanyContactsForm({ contacts, onDelete }: CompanyContactsFormProps) {

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
            <div className="flex-col-container">
                {contacts?.map(contact => {
                    return (
                        <div
                            key={contact?.id}
                            className='grid grid-cols-1 gap-4 relative md:grid-cols-2 border-2 p-4 rounded-xl'
                        >
                            <div className='space-y-2'>
                                <label>Name</label>
                                <Input type="text" defaultValue={contact?.name} readOnly />
                            </div>
                            <div className='space-y-2'>
                                <label>Contact Number</label>
                                <Input type="text" defaultValue={contact?.contact_number} readOnly />
                            </div>
                            <div className='space-y-2'>
                                <label>Email</label>
                                <Input type="text" defaultValue={contact?.email} readOnly />
                            </div>
                            <div className='space-y-2'>
                                <label>Manager Of</label>
                                <Input type="text" defaultValue={contact?.manager_of} readOnly />
                            </div>
                            {onDelete &&
                                <Button
                                    className='absolute top-2 right-2'
                                    size='iconExSm'
                                    variant='destructive'
                                    onClick={async () => await onDelete({
                                        contact: {
                                            id: contact.id
                                        }
                                    })}
                                >
                                    <Icon name="Trash" />
                                </Button>
                            }
                        </div>
                    )
                })}
            </div>
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