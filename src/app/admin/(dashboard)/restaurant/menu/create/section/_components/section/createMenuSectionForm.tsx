import { CreateMenuSectionFormSchema, CreateMenuSectionFormSchemaType } from "@/common/libs/zod/forms/restaurant/createMenuSectionForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateMenuSectionFormProps {
    createSection: (data: any) => void
    isLoading: boolean
}

export default function CreateMenuSectionForm({ createSection, isLoading }: CreateMenuSectionFormProps) {
    const form = useForm<CreateMenuSectionFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateMenuSectionFormSchema),
        defaultValues: {
            title: "",
            bg_color: "",
        },
    });

    const onSubmitForm: SubmitHandler<CreateMenuSectionFormSchemaType> = async (formData) => {
        await createSection({
            menu_section: {
                ...formData
            }
        })
        form.reset()
    };


    return (
        <Form {...form}>
            <form
                className='flex-col-container border-2 p-4 rounded-xl'
                onSubmit={form.handleSubmit(onSubmitForm)}>
                <h1 className='font-bold text-lg'>Section</h1>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Main Course"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex-container-center gap-4'>
                    <FormField
                        control={form.control}
                        name="bg_color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input
                                        type="color"
                                        placeholder="Main Course"
                                        className='h-10'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This color will be used as background color for all the Menu items in this section, remember to check in light and dark mode.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex-container-center justify-center min-w-40 h-40 rounded-lg text-white dark:text-block'
                        style={{
                            backgroundColor: form.watch('bg_color'),
                        }}
                    >
                        Burger
                    </div>
                </div>
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