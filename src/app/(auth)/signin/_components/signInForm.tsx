'use client'
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

//libs
import { SignInFormSchema, SignInFormSchemaType } from '@/common/libs/zod/forms/auth/signin';

//components
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/common/libs/lucida-icon';

//hooks
import { useAuthHooks } from '@/hooks/useAuthHooks';
import { useRouter } from "next/navigation";
import { EndPointsTypes } from '@/common/types/routers/endPoints.types';

export function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
    const [preRendered, setPreRendered] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { handleSignIn } = useAuthHooks()

    const form = useForm<SignInFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmitForm: SubmitHandler<SignInFormSchemaType> = (formData) => {
        setIsLoading(true)
        toast.promise(handleSignIn({
            email: formData.email,
            password: formData.password

        }), {
            loading: "Signing in...",
            success: () => {
                const path = EndPointsTypes.AUTH_ENDPOINT_WHEN_SIGN_IN
                router.push(path)
                setIsLoading(false)
                return "Signed in successfully!";
            },
            error: (err) => {
                setIsLoading(false)
                return err.message || "Something went wrong!"
            },
        })
        form.reset()
    };

    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <SignInForm.Skeleton />;
    }

    return (
        <Form {...form}>
            <form
                onChange={() => submitError && setSubmitError("")}
                onSubmit={form.handleSubmit(onSubmitForm)}
                className='flex flex-col gap-4 w-full'>
                <h1 className='text-4xl font-bold'>Sign In</h1>
                <small className='mb-4'>Enter your user name and password to sign in!</small>

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
                <div className='relative'>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="button"
                        variant='ghost'
                        className='absolute right-[-14px] top-[-14px] mt-4 mr-4 h-8 w-8 p-2'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Icon name='Eye' size={12} /> : <Icon name='EyeOff' size={12} />}
                    </Button>
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className='mb-4'
                    leftIcon={<Icon name='LogIn' size={18} />}
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
            </form>
        </Form>
    )
}

SignInForm.Skeleton = function SignInformSkeleton() {
    return (
        <div className="flex flex-col space-y-4 w-full">
            <Skeleton className="w-40 h-14" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
        </div>
    )
}