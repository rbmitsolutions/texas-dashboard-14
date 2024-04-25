import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//libs
import { CreateSupplierBankTypeFormSchema, CreateSupplierBankTypeFormSchemaType } from "@/common/libs/zod/forms/stock/createSupplierBank";

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
import { IStockSupplierBank } from "@/common/types/restaurant/stock.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";

interface CreateUpdateBankProps {
    supplier_id: string
    bank?: IStockSupplierBank
    updateBank: UseMutateFunction<any, any, IPUTStockBody, unknown>
    createBank: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
}

export default function CreateUpdateBank({ supplier_id, bank, updateBank, createBank }: CreateUpdateBankProps) {

    const form = useForm<CreateSupplierBankTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierBankTypeFormSchema),
        defaultValues: {
            title: '',
            iban: '',
            bic: ''
        },
    });

    const onSubmitForm: SubmitHandler<CreateSupplierBankTypeFormSchemaType> = async (formData) => {
        if (bank) {
            await updateBank({
                bank: {
                    ...formData,
                    id: bank.id
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        } else {
            await createBank({
                bank: {
                    ...formData,
                    supplier_id
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }
    };

    useEffect(() => {
        if (bank) {
            form.reset({
                title: bank?.title || '',
                iban: bank?.iban || '',
                bic: bank?.bic || ''
            })
        }
    }, [form, bank])

    return (
        <div>
            <strong className='text-primary'>Bank Details</strong>
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
                                <FormLabel>Bank Name</FormLabel>
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
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name="iban"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>IBAN</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="IBAN"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BIC</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="BIC"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        variant='blue'
                        leftIcon='Save'
                        className='self-end'
                    >
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    )
}
