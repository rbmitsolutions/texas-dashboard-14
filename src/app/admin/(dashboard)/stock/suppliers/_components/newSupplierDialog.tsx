import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateSupplierTypeFormSchema, CreateSupplierTypeFormSchemaType } from "@/common/libs/zod/forms/restaurant/createSupplierForm";

//components
import {
    Form,
    FormControl,
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
import { IStockSuppliers } from "@/common/types/restaurant/stock.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";

interface NewSupplierDialogProps {
    update?: {
        supplier: IStockSuppliers
        updateSupplier: UseMutateFunction<any, any, IPUTStockBody, unknown>
    }
    createSupplier?: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
}

export default function NewSupplierDialog({ update, createSupplier }: NewSupplierDialogProps) {

    const form = useForm<CreateSupplierTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierTypeFormSchema),
        defaultValues: {
            title: '',
            address: ''
        },
    });

    const onSubmitForm: SubmitHandler<CreateSupplierTypeFormSchemaType> = async (formData) => {
        if (createSupplier) {
            await createSupplier({
                supplier: {
                    ...formData
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }

        if (update?.updateSupplier) {
            await update.updateSupplier({
                supplier: {
                    ...formData,
                    id: update.supplier.id
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }
    };

    useEffect(() => {
        if (update?.supplier) {
            form.reset({
                title: update?.supplier?.title,
                address: update?.supplier?.address
            })
        }
    }, [form, update])

    return (
        <Dialog
            onOpenChange={() => form.reset()}
        >
            <DialogTrigger asChild>
                <Button
                    variant='orange'
                    leftIcon={update ? 'RefreshCcw' : 'Plus'}
                >
                    {update ? 'Update' : 'New Supplier'}
                </Button>
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Title"
                                            {...field}
                                        />
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
                                        <Input
                                            placeholder="Address"
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
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}