'use client'
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { cn } from '@/common/libs/shadcn/utils';

//libs
import { SignInFormSchema, SignInFormSchemaType } from '@/common/libs/zod/forms/auth/signinForm';

//components
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ForgotPasswordForm() {
    const [preRendered, setPreRendered] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const form = useForm<SignInFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmitForm: SubmitHandler<SignInFormSchemaType> = async (formData) => {
        //   toast.promise(actionAuthSignIn(formData), {
        //     loading: "Signing in...",
        //     success: "Signed in successfully!",
        //     error: (err) => err.message,
        //   })
        console.log(formData)
        form.reset()
        //   router.refresh()

    };

    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <ForgotPasswordForm.Skeleton />;
    }

    return (
        <Form {...form}>
            <form
                onChange={() => submitError && setSubmitError("")}
                onSubmit={form.handleSubmit(onSubmitForm)}
                className='flex flex-col gap-4'>
                <h1 className='text-4xl font-bold'>Forgot</h1>
                <small className='mb-4'>An email will be send to you!</small>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn("mb-4", isLoading && "loading")}
                    leftIcon='Lock'
                    isLoading={false}
                >
                    Recover Password
                </Button>
            </form>
        </Form>
    )
}

ForgotPasswordForm.Skeleton = function SignInformSkeleton() {
    return (
        <div className="flex flex-col space-y-4 w-full">
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
        </div>
    )
}