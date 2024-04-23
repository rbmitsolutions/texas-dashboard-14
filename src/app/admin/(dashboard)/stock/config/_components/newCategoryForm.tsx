import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateCategoryTypeFormSchema, CreateCategoryTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createCategoryForm";

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

interface NewCategoryProps {
    createCategory: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
}

export default function NewCategory({ createCategory }: NewCategoryProps) {
    const form = useForm<CreateCategoryTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateCategoryTypeFormSchema),
        defaultValues: {
            title: '',
        },
    });

    const onSubmitForm: SubmitHandler<CreateCategoryTypeFormSchemaType> = async (formData) => {
        await createCategory({
            category: {
                ...formData
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    };

    return (
        <div className='bg-background-soft p-4 rounded-md'>
            <strong>Category</strong>
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