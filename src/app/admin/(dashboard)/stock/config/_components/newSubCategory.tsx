import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateSubCategotyTypeFormSchema, CreateSubCategotyTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createSubCategoryForm";

//components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IStockCategories } from "@/common/types/restaurant/stock.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewSubCategoryProps {
    createSubCategory: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
    categories: IStockCategories[]
}

export default function NewSubCategory({ createSubCategory, categories }: NewSubCategoryProps) {
    const form = useForm<CreateSubCategotyTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSubCategotyTypeFormSchema),
        defaultValues: {
            title: '',
            category_id: ''
        },
    });

    const onSubmitForm: SubmitHandler<CreateSubCategotyTypeFormSchemaType> = async (formData) => {
        await createSubCategory({
            sub_category: {
                ...formData
            }
        }, {
            onSuccess: () => {
                form.reset({
                    title: '',
                    category_id: ''
                })
            }
        })
    };

    return (
        <div className='bg-background-soft p-4 rounded-md'>
            <strong>Sub Category</strong>
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
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map(category => {
                                            return (
                                                <SelectItem key={category?.id} value={category?.id}>{category.title}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
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
        </div>
    )
}