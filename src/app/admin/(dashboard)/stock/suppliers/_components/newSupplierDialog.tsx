import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateSupplierTypeFormSchema, CreateSupplierTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createSupplierForm";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IStockCategories, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";

interface NewSupplierDialogProps {
    categories: IStockCategories[]
    update?: {
        supplier: IStockSuppliers
        updateSupplier: UseMutateFunction<any, any, IPUTStockBody, unknown>
    }
    createSupplier?: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
}

export default function NewSupplierDialog({ categories, update, createSupplier }: NewSupplierDialogProps) {

    const form = useForm<CreateSupplierTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierTypeFormSchema),
        defaultValues: {
            title: '',
            address: '',
            categories_id: []
        },
    });

    const onSubmitForm: SubmitHandler<CreateSupplierTypeFormSchemaType> = async (formData) => {
        if (createSupplier) {
            await createSupplier({
                supplier: {
                    ...formData,
                    connect: {
                        categories: {
                            id: formData.categories_id
                        }
                    }
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }

        if (update?.updateSupplier) {
            const connect = formData?.categories_id?.map(id => ({ id }))
            const disconnect = update?.supplier.categories?.filter(category => !formData.categories_id.includes(category.id)).map(category => ({ id: category.id }))

            await update.updateSupplier({
                supplier: {
                    ...formData,
                    id: update.supplier.id,
                    connect: {
                        categories: {
                            id: connect?.map(category => category?.id)
                        }
                    },
                    disconnect: {
                        categories: {
                            id: disconnect?.map(category => category?.id)
                        }
                    }
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
                address: update?.supplier?.address,
                categories_id: update?.supplier?.categories?.map(category => category?.id) || []
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
                    {update ? 'Update' : 'Supplier'}
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
                        <FormField
                            control={form.control}
                            name="categories_id"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Categories</FormLabel>
                                        <FormDescription>
                                            Select the categories that this supplier provides
                                        </FormDescription>
                                    </div>

                                    <div className='flex flex-wrap gap-4'>
                                        {categories?.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="categories_id"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal">
                                                                {item?.title}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
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