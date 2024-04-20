import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateExtraItemEntryFormSchema, CreateExtraItemEntryFormSchemaType } from "@/common/libs/zod/forms/stock/createExtraItemEntry";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IStockItem } from "@/common/types/restaurant/stock.interface";
import { IToken, Permissions } from "@/common/types/auth/auth.interface";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";

interface NewItemEntryDialogProps {
    item: IStockItem
    createEntry: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
    user: IToken
}

export default function NewItemEntryDialog({ item, createEntry, user }: NewItemEntryDialogProps) {
    const form = useForm<CreateExtraItemEntryFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateExtraItemEntryFormSchema),
        defaultValues: {
            quantity: 0,
            description: ''
        },
    });

    const onSubmitForm: SubmitHandler<CreateExtraItemEntryFormSchemaType> = async (formData) => {
        const quantity = formData?.quantity * item?.volume
  
        await createEntry({
            extra_item_entry: {
                entry_by: user?.name,
                entry_by_id: user?.user_id,
                item_id: item?.id,
                quantity,
                new_stock: item?.stock + quantity,
                old_stock: item?.stock,
                description: formData?.description
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    };

    return (
        <Dialog
            onOpenChange={() => form.reset()}
        >
            <DialogTrigger asChild>
                <Button
                    variant='orange'
                    size='iconSm'
                    disabled={!isUserAuthorized(
                        user,
                        [Permissions.ADMIN, Permissions.STOCK_MANAGER]
                    )}
                >
                    <Icon name='Plus' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>New Item Entry</DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className="flex-col-container"
                    >

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <Input
                                        type='number'
                                        className='w-full'
                                        {...field}
                                        onChange={(e) => form.setValue('quantity', Number(e.target.value))}
                                    />
                                    <FormMessage />
                                    <FormDescription>
                                        Current Stock: {item?.stock} {item?.unit}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notes"
                                            className="resize-none h-40"
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
            </DialogContent>
        </Dialog>
    )
}