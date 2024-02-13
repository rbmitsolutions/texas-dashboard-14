import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//hooks
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";

//interface
import { CreateSectionTypeFormSchema, CreateSectionTypeFormSchemaType } from "@/common/libs/zod/forms/restaurant/createSection";

interface AddSectionProps {
    addSection: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
}

export default function AddSection({
    addSection
}: AddSectionProps): JSX.Element {
    const form = useForm<CreateSectionTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSectionTypeFormSchema),
        defaultValues: {
            title: '',
            priority: 1
        },
    });

    const onSubmitForm: SubmitHandler<CreateSectionTypeFormSchemaType> = async (formData) => {
        await addSection({
            section: {
                ...formData
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    leftIcon="Plus"
                    size='sm'
                >
                    Section
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="start">
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
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Priority"
                                            min={1}
                                            step={1}
                                            max={3}
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(Number(e.target.value))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            leftIcon="Save"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}