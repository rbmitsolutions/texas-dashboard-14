import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateMenuTypeFormSchema, CreateMenuTypeFormSchemaType } from "@/common/libs/zod/forms/restaurant/createMenuTypeForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { UseMutateFunction } from "react-query";

interface CreateMenuTypeFormProps {
    createType: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    isLoading: boolean
    menuSections: IMenuSection[]
}

export default function CreateMenuTypeForm({ createType, menuSections, isLoading }: CreateMenuTypeFormProps) {

    const form = useForm<CreateMenuTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateMenuTypeFormSchema),
        defaultValues: {
            section_id: '',
            title: '',
        },
    });


    const onSubmitForm: SubmitHandler<CreateMenuTypeFormSchemaType> = async (formData) => {
        await createType({
            menu_type: {
                title: formData.title,
                section_id: formData.section_id,
            }
        })
        form.reset()
    };


    return (
        <Form {...form}>
            <form
                className='flex-col-container border-2 p-4 rounded-xl'
                onSubmit={form.handleSubmit(onSubmitForm)}>
                <h1 className='font-bold text-lg'>Type</h1>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Burger"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="section_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Section</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Section" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {menuSections?.map(sec => {
                                        return (
                                            <SelectItem key={sec?.id} value={sec?.id}>
                                                {sec?.title}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                The section where this type will be located
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <Button
                    type="submit"
                    className='self-end'
                    leftIcon='Save'
                    isLoading={isLoading}
                    disabled={!form.formState.isValid || isLoading}
                >
                    Create
                </Button>
            </form>
        </Form>
    )
}