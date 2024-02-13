import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

//libs
import { CreateTableTypeFormSchema, CreateTableTypeFormSchemaType } from "@/common/libs/zod/forms/restaurant/createTable";
import Icon from "@/common/libs/lucida-icon";

//interface
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { UseMutateFunction } from "react-query";
import { ISection } from "@/common/types/restaurant/tables.interface";

interface AddTableProps {
    addTable: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    section: ISection
}

export default function AddTable({ addTable, section }: AddTableProps): JSX.Element {

    const form = useForm<CreateTableTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateTableTypeFormSchema),
        defaultValues: {
            guests: 2,
            number: 1
        },
    });

    const onSubmitForm: SubmitHandler<CreateTableTypeFormSchemaType> = async (formData) => {
        await addTable({
            table: {
                ...formData,
                section_id: section.id
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
                <Button leftIcon="Plus" size='sm' className='h-6'>
                    Table
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
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Table Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Table Number"
                                            min={1}
                                            step={1}
                                            max={50}
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
                        <FormField
                            control={form.control}
                            name="guests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guests 2 / 4 / 6 / 8</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Guests"
                                            min={1}
                                            step={1}
                                            max={8}
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