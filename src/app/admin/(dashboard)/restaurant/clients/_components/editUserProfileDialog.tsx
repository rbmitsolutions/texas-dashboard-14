import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import Icon from "@/common/libs/lucida-icon";

//components
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

//interface
import { IClientSchema, UpdateClientFormSchema, UpdateClientSchemaType } from "@/common/libs/zod/forms/restaurant/clientsForm";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { useEffect } from "react";

interface EditUserProfileDialogProps {
    client: IClientSchema
    udpateClient: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    isUpdateClientLoading: boolean
}

export default function EditUserProfileDialog({ client, udpateClient, isUpdateClientLoading }: EditUserProfileDialogProps) {

    const form = useForm<UpdateClientSchemaType>({
        mode: "onChange",
        resolver: zodResolver(UpdateClientFormSchema),
        defaultValues: {
            name: client?.name || '',
            contact_number: client?.contact_number || '',
            email: client?.email || '',
        },
    });


    const onSubmitForm: SubmitHandler<UpdateClientSchemaType> = async (formData) => {
        await udpateClient({
            client: {
                client: {
                    id: client.id,
                    name: formData.name,
                    contact_number: formData.contact_number,
                    email: formData.email,
                }
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    };

    useEffect(() => {
        form.reset({
            name: client?.name || '',
            contact_number: client?.contact_number || '',
            email: client?.email || '',
        })
    }, [client, form])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='orange'
                    size='iconSm'
                >
                    <Icon name='Pen' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className='self-end'
                            leftIcon="Save"
                            isLoading={form.formState.isSubmitting || isUpdateClientLoading}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
