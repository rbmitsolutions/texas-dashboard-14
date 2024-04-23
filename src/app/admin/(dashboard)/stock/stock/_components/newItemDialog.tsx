import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateItemTypeFormSchema, CreateItemTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createItemForm";
import { cn } from "@/common/libs/shadcn/utils";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IStockCategories, IStockItem, StockItemUnit } from "@/common/types/restaurant/stock.interface";
import { IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";

interface NewItemDialogProps {
    update?: {
        item: IStockItem
        updateItem: UseMutateFunction<any, any, IPUTStockBody, unknown>
    }
    createItem?: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
    categories: {
        categories: IStockCategories[]
        categoriesParams: IGETStockDataQuery
        setCategoriesParams: Dispatch<SetStateAction<IGETStockDataQuery>>
    }
}

export default function NewItemDialog({ update, createItem, categories }: NewItemDialogProps) {
    const [category, setCategory] = useState<IStockCategories | null>(null)

    const form = useForm<CreateItemTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateItemTypeFormSchema),
        defaultValues: {
            title: '',
            max_stock: 0,
            min_stock: 0,
            unit: StockItemUnit.PIECE,
            volume: 0,
        },
    });

    const onSubmitForm: SubmitHandler<CreateItemTypeFormSchemaType> = async (formData) => {
        if (createItem) {
            await createItem({
                item: {
                    ...formData,
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }

        if (update?.updateItem) {
            await update.updateItem({
                item: {
                    ...formData,
                    id: update.item.id
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }
    };

    const onOpenChange = () => {
        form.reset()
        setCategory(null)
    }

    useEffect(() => {
        if (update?.item) {
            form.reset({
                title: update?.item?.title || '',
                max_stock: update?.item?.max_stock || 0,
                min_stock: update?.item?.min_stock || 0,
                category_id: update?.item?.category_id || '',
                sub_category_id: update?.item?.sub_category_id || '',
                unit: (update?.item?.unit as any) || StockItemUnit.UNIT,
            })
        }
    }, [form, update?.item])

    return (
        <Dialog
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <Button
                    variant='orange'
                    leftIcon={update ? 'RefreshCcw' : 'Plus'}
                >
                    {update ? 'Update' : 'Item'}
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
                            name="category_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Category</FormLabel>
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
                                                        ? categories?.categories?.find(
                                                            (item) => item?.id === field.value
                                                        )?.title
                                                        : "Select Category"}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-2">
                                            <div className='p-2'>
                                                <SearchInput
                                                    onSearchChange={(e) => {
                                                        form.setValue("category_id", '')
                                                        setCategory(null)
                                                        categories?.setCategoriesParams(prev => ({
                                                            category: {
                                                                all: {
                                                                    ...prev?.category?.all,
                                                                    title: e
                                                                }
                                                            }
                                                        }))
                                                    }}
                                                    value={categories?.categoriesParams?.category?.all?.title || ''}
                                                />
                                                <div className='h-40 overflow-auto mt-2'>
                                                    {categories?.categories?.map(c => {
                                                        return (
                                                            <div
                                                                key={c?.id}
                                                                className={cn('bg-background-soft p-1 line-clamp-1 cursor-pointer hover:opacity-50 border-2 rounded-sm', c?.id === field.value && 'border-primary')}
                                                                onClick={() => {
                                                                    form.setValue("category_id", c?.id)
                                                                    setCategory(c)
                                                                }}
                                                            >
                                                                <small>
                                                                    {c?.title}
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
                        <FormField
                            control={form.control}
                            name="sub_category_id"
                            disabled={!category}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sub Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Sub Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {category?.sub_categories?.map(sub => {
                                                return (
                                                    <SelectItem key={sub.id} value={sub.id}>{sub.title}</SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="min_stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min. Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="200"
                                                type='number'
                                                step='1'
                                                {...field}
                                                onChange={(e) => {
                                                    form.setValue('min_stock', Number(e.target.value))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="max_stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max. Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="100"
                                                type='number'
                                                step='1'
                                                {...field}
                                                onChange={(e) => {
                                                    form.setValue('max_stock', Number(e.target.value))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <small>Min and Max Stock it is according the quantity of items you want to have in stock, eg: Min: 200 cokes and Max: 500 cokes</small>

                        <div className='grid grid-cols-[1fr,100px] gap-4'>
                            <FormField
                                control={form.control}
                                name="volume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Volume</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="200"
                                                type='number'
                                                step='1'
                                                {...field}
                                                value={String(field.value)}
                                                onChange={(e) => {
                                                    form.setValue('volume', Number(e.target.value))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="unit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(StockItemUnit).map((type) => {
                                                    return (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <small>Volume and Unit it is the description of the item, eg: Coke 200ml </small>
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