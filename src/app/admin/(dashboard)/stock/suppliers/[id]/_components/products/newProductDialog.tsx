import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateProductTypeFormSchema, CreateProductTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createProductForm";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IStockItem, IStockProducts, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";
import { IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";

interface NewProductDialogProps {
    update?: {
        product: IStockProducts
        updateProduct: UseMutateFunction<any, any, IPUTStockBody, unknown>
    }
    createProduct?: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
    items: {
        items: IStockItem[]
        setItemsParams: Dispatch<SetStateAction<IGETStockDataQuery>>
        itemsParams: IGETStockDataQuery
    }
    supplier_id: string
}

export default function NewProductDialog({ update, createProduct, supplier_id, items }: NewProductDialogProps) {

    const form = useForm<CreateProductTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateProductTypeFormSchema),
        defaultValues: {
            code: '',
            title: '',
            item_id: '',
            supplier_id: supplier_id,
            pack_quantity: 0
        },
    });

    const onSubmitForm: SubmitHandler<CreateProductTypeFormSchemaType> = async (formData) => {
        if (createProduct) {
            await createProduct({
                product: {
                    ...formData
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }

        if (update?.updateProduct) {
            await update.updateProduct({
                product: {
                    id: update.product.id,
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
        if (update?.product) {
            form.reset({
                code: update?.product.code,
                title: update?.product.title,
                item_id: update?.product.item_id,
                pack_quantity: update?.product.pack_quantity,
                supplier_id: update?.product.supplier_id
            })
        }
    }, [form, update])

    return (
        <Dialog
            onOpenChange={() => form.reset()}
        >
            <DialogTrigger asChild>
                {update ?
                    <Button
                        variant='orange'
                        size='iconSm'
                    >
                        <Icon name='Pen' />
                    </Button>
                    :
                    <Button
                        variant='orange'
                        leftIcon='Plus'
                    >
                        Product
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
                            name="item_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Item</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? items?.items?.find(
                                                            (item) => item?.id === field.value
                                                        )?.title
                                                        : "Select Item"}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-2">
                                            <div className='p-2'>
                                                <SearchInput
                                                    onSearchChange={(e) => {
                                                        form.setValue("item_id", '')
                                                        items?.setItemsParams(prev => ({
                                                            item: {
                                                                all: {
                                                                    ...prev?.item?.all,
                                                                    title: e
                                                                }
                                                            }
                                                        }))
                                                    }}
                                                    value={items?.itemsParams?.item?.all?.title || ''}
                                                />
                                                <div className='h-40 overflow-auto mt-2'>
                                                    {items?.items?.map(i => {
                                                        return (
                                                            <div
                                                                key={i?.id}
                                                                className={cn('bg-background-soft p-1 line-clamp-1 cursor-pointer hover:opacity-50 border-2 rounded-sm', i?.id === field.value && 'border-primary')}
                                                                onClick={() => {
                                                                    form.setValue("item_id", i?.id)
                                                                }}
                                                            >
                                                                <small>
                                                                    {i?.title}
                                                                </small>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid-container grid-cols-[120px,auto]'>
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <FormDescription>
                                            Eg. Coke Box 24 Cans
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="pack_quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pack Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Pack Quantity"
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={(e) => form.setValue("pack_quantity", Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        Eg. 24 Cans
                                    </FormDescription>
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
        </Dialog >
    )
}