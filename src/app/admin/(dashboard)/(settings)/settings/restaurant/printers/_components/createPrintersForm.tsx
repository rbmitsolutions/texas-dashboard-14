import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { UseMutateFunction } from "react-query";


//libs
import { CreatePrintersFormSchema, CreatePrintersFormSchemaType } from "@/common/libs/zod/forms/settings/createPrintersForms";

//components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";

interface CreatePrintersFormProps {
    createPrinter: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    isLoading: boolean
}

export default function CreatePrintersForm({ createPrinter, isLoading }: CreatePrintersFormProps) {

    const form = useForm<CreatePrintersFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreatePrintersFormSchema),
        defaultValues: {
            description: "",
            ip: '',
            title: "",
        },
    });


    const onSubmitForm: SubmitHandler<CreatePrintersFormSchemaType> = async (formData) => {
        await createPrinter({
            printer: formData
        }, {
            onSuccess: () => form.reset()
        })
        
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
                                    placeholder="Kitchen Printer"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ip"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ip</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="1.0.0.1"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Aditional information" className='h-40'{...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


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