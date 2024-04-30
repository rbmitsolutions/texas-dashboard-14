import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseMutateFunction } from "react-query"
import { CalendarIcon } from "lucide-react"

//libs
import { CreatePaymentToUserFormSchema, CreatePaymentToUserFormSchemaType } from "@/common/libs/zod/forms/user/createPaymentToUserForm"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"

//components
import {
    Dialog,
    DialogClose,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { PayrollTransactionsType, TransactionsDirection, TransactionsMethod } from "@/common/types/company/transactions.interface"
import { IUser } from "@/common/types/user/user.interface"
import { useAuthHooks } from "@/hooks/useAuthHooks"

interface CreatePaymentToUserProps {
    user: IUser
    createTransaction: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
}

export default function CreatePaymentToUser({ user, createTransaction }: CreatePaymentToUserProps) {
    const { user: token } = useAuthHooks()
    const form = useForm<CreatePaymentToUserFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreatePaymentToUserFormSchema),
        defaultValues: {
            date: new Date(),
            type: PayrollTransactionsType.PAYROLL,
            total: 0
        },
    });



    const onSubmitForm: SubmitHandler<CreatePaymentToUserFormSchemaType> = async (formData) => {
        await createTransaction({
            transaction: {
                one: {
                    date: formData.date,
                    direction: TransactionsDirection.OUT,
                    method: TransactionsMethod.PAYROLL,
                    total: Number(formData.total.toFixed(2)),
                    type: formData.type,
                    payee_key: user.id,
                    description: `Payment to ${user?.name} `,
                    valid_by: token?.name,
                    valid_by_id: token?.user_id,
                    payee: user.name
                }
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    }
    return (
        <Dialog
            onOpenChange={() => form.reset()}
        >
            <DialogTrigger asChild>

                <Button
                    leftIcon="Plus"
                    size='sm'
                    variant='orange'
                >
                    New Payment
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Create</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="flex-col-container gap-6"
                        onSubmit={form.handleSubmit(onSubmitForm)}
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a payment type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={PayrollTransactionsType.PAYROLL}>Payroll</SelectItem>
                                            <SelectItem value={PayrollTransactionsType.ADJUSTMENT}>Adjustment</SelectItem>
                                            <SelectItem value={PayrollTransactionsType.BANK_HOLIDAY_PAY}>Bank Holiday Pay</SelectItem>
                                            <SelectItem value={PayrollTransactionsType.HOLIDAY}>Holiday</SelectItem>
                                            <SelectItem value={PayrollTransactionsType.TIPS}>Tips</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="total"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            step='0.01'
                                            placeholder="total"
                                            {...field}
                                            value={String(field.value / 100)}
                                            onChange={(e) => field.onChange(Number(e.target.value) * 100)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        formatDate({
                                                            date: new Date(field.value),
                                                            f: "PPP"
                                                        })
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(field.value)}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            leftIcon="Save"
                            isLoading={form.formState.isSubmitting}
                            disabled={form.formState.isSubmitting || !form.formState.isValid}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}