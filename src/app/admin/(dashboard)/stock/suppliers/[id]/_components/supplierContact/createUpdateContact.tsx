import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateSupplierContactTypeFormSchema, CreateSupplierContactTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createSupplierContactForm";
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon";

//components
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IStockSupplierContacts } from "@/common/types/restaurant/stock.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";

interface CreateUpdateContactProps {
    supplier_id: string
    update?: {
        contact: IStockSupplierContacts
        updateContact: UseMutateFunction<any, any, IPUTStockBody, unknown>
    }
    createContact?: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
}

export default function CreateUpdateContact({ supplier_id, update, createContact }: CreateUpdateContactProps) {

    const form = useForm<CreateSupplierContactTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierContactTypeFormSchema),
        defaultValues: {
            name: '',
            contact_number: '',
            email: ''
        },
    });

    const onSubmitForm: SubmitHandler<CreateSupplierContactTypeFormSchemaType> = async (formData) => {
        if (createContact) {
            await createContact({
                contact: {
                    ...formData,
                    supplier_id
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }

        if (update?.updateContact) {
            await update.updateContact({
                contact: {
                    id: update?.contact?.id,
                    ...formData,
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }
    };

    useEffect(() => {
        if (update?.contact) {
            form.reset({
                name: update?.contact?.name || '',
                contact_number: update?.contact?.contact_number || '',
                email: update?.contact?.email || ''
            })
        }
    }, [form, update])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {update ?
                    <Button
                        variant='blue'
                        size='iconSm'
                    >
                        <Icon name='Pen' />
                    </Button>
                    :
                    <Button
                        variant='blue'
                        leftIcon='Plus'
                    >
                        Contact
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{update ? 'Update' : 'Create'}</DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className="flex-col-container"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
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
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant='blue'
                            type='submit'
                            className='self-end'
                            leftIcon="Save"
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}