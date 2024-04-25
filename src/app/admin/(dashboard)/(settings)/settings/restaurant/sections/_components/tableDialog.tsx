import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//libs
import { cn } from "@/common/libs/shadcn/utils";

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interface
import { UpdateTableTypeFormSchema, UpdateTableTypeFormSchemaType } from "@/common/libs/zod/forms/restaurant/createTable";
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { ISection, ITable } from "@/common/types/restaurant/tables.interface";

interface TableDialogProps {
    table: ITable
    sections: ISection[]
    deleteTable: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    editTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function TableDialog({ table, sections, deleteTable, editTable }: TableDialogProps) {

    const form = useForm<UpdateTableTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(UpdateTableTypeFormSchema),
        defaultValues: {
            section_id: table?.section_id,
            number: table?.number,
            guests: table?.guests,
        },
    });

    const onSubmitForm: SubmitHandler<UpdateTableTypeFormSchemaType> = async (formData) => {
        await editTable ({
            table:{
                id: table?.id,
                ...formData
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>

                <Button
                    size='sm'
                    variant='outline'
                    className='flex items-center bg-background-soft rounded-lg cursor-pointer p-2 hover:bg-red-300 dark:hover:bg-red-800'
                >
                    Nº: {table?.number} / Seats: {table?.guests} / <div className={cn("h-3 w-3 rounded-full ml-2", table?.is_open ? 'bg-green-600' : 'bg-red-500')} />
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className='flex-container justify-between mt-4'>
                        <DialogTitle className='capitalize'>Table {table?.number}</DialogTitle>
                        <DeleteDialogButton
                            onDelete={async () => await deleteTable({
                                table: {
                                    id: table?.id
                                }
                            })}
                            isDisabled={table?.is_open}
                        />
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="flex-col-container gap-6"
                        onSubmit={form.handleSubmit(onSubmitForm)}
                    >
                        <FormField
                            control={form.control}
                            name="section_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sections?.map(sec => {
                                                return (
                                                    <SelectItem key={sec?.id} value={sec?.id}>
                                                        {sec?.title}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent >
        </Dialog >
    )
}