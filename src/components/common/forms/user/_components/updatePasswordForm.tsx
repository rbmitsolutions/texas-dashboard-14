import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseMutateFunction } from "react-query"
import toast from "react-hot-toast"
import { useState } from "react"

//components
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChangePasswordFormSchema, ChangePasswordFormSchemaType } from "@/common/libs/zod/forms/auth/passwordForm"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//interface
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"
import { IUser } from "@/common/types/user/user.interface"

interface UpdatePasswordFormProps {
    user: IUser
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
    alwaysOpen?: boolean
}

export default function UpdatePasswordForm({ user, onUpdate, alwaysOpen = false }: UpdatePasswordFormProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<ChangePasswordFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(ChangePasswordFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onOpenChange = () => {
        setIsOpen(!isOpen)
        form.reset()
    }

    const onSubmitForm: SubmitHandler<ChangePasswordFormSchemaType> = async (formData) => {
        await onUpdate({
            details: {
                id: user?.id,
                password: formData?.password
            }
        }, {
            onSuccess: () => {
                toast.success("Password changed successfully!")
            }
        })
        onOpenChange()
    };

    return (
        <AlertDialog
            open={alwaysOpen ? true : isOpen}
            onOpenChange={onOpenChange}
        >
            {!alwaysOpen &&
                <AlertDialogTrigger asChild>
                    <Button
                        leftIcon='KeySquare'
                        onClick={onOpenChange}
                    >Change Password
                    </Button>
                </AlertDialogTrigger>
            }
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change Password</AlertDialogTitle>
                    <AlertDialogDescription>

                    </AlertDialogDescription>

                </AlertDialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className='flex-col-container gap-4'>
                            <strong className="text-[12px]" >Password must contain at least one letter, one number, and one special character and it can not contain the word &apos;texas&apos;, &apos;texassteak&apos;, &apos;steakout&apos;, or &apos;texassteakout&apos;.</strong>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-end gap-4'>
                            <Button
                                type="button"
                                variant='secondary'
                                className='text-sm'
                                onClick={onOpenChange}
                                disabled={alwaysOpen}
                            >Cancel</Button>
                            <Button
                                type="submit"
                                className='text-sm'
                                leftIcon="Save"
                            >Save</Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}