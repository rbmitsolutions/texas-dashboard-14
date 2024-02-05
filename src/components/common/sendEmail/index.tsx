import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Badge } from "@/components/ui/badge"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"
import { Input } from "@/components/ui/input"
import RichText from "../richText"

//lins
import { ComponentsSendEmailSchema, ComponentsSendEmailSchemaType } from "@/common/libs/zod/forms/components/sendEmail"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"

//api
import { api } from "@/common/libs/axios/api"
import toast from "react-hot-toast"
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { Permissions } from "@/common/types/auth/auth.interface"
import { useAuthHooks } from "@/hooks/useAuthHooks"

export interface SendEmailContacts {
    id: string;
    name: string;
    email: string;
}

interface SendEmaiLProps {
    contacts: SendEmailContacts[]
}

//todo: change router in back-end to group message
export default function SendEmail({ contacts }: SendEmaiLProps) {
    const { user: { permissions } } = useAuthHooks()
    const form = useForm<ComponentsSendEmailSchemaType>({
        mode: "onChange",
        resolver: zodResolver(ComponentsSendEmailSchema),
        defaultValues: {
            subject: 'Texas Steakout',
            message: ''
        },
    });

    const onOpenChange = () => {
        form.reset()
    }

    const onSubmitForm: SubmitHandler<ComponentsSendEmailSchemaType> = async (formData) => {
        try {
            await api.post(`${EndPointsTypes['SERVICES_EMAIL_ENDPOINT']}`, {
                data: {
                    group: {
                        email: contacts?.map(c => c.email),
                        subject: formData.subject,
                        message: formData.message,
                    }
                }
            })
            toast.success('Email Sent')
            onOpenChange()
        } catch (err) {
            console.log(err)
        }
        form.reset()
    };
    return (
        <Sheet
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                <Button variant="outline" className='p-1' size='icon'
                    disabled={!isUserAuthorized(
                        permissions,
                        [Permissions.SEND_SMS]
                    )}
                >
                    <Icon name="Mail" />
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Email To</SheetTitle>
                </SheetHeader>
                <div className="flex-col-container">
                    <div className='flex flex-wrap items-start gap-2 max-h-40 overflow-auto scrollbar-thin'>
                        {contacts?.map(c => {
                            return <Badge key={c.id}>{c.name}</Badge>
                        })}
                    </div>
                    <div className="flex-col-container">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmitForm)}
                                className='flex flex-col gap-4 w-full'>
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Subject"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch('message').length > 1 &&
                                    <div
                                        dangerouslySetInnerHTML={{ __html: form.watch('message') }}
                                        className='max-h-60 overflow-auto scrollbar-thin p-2 bg-background-soft rounded-lg'
                                    />
                                }
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RichText
                                                    description={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </form>
                        </Form>

                    </div>
                </div>
                <SheetFooter className=''>
                    <SheetClose asChild>
                        <Button
                            leftIcon='Send'
                            onClick={form.handleSubmit(onSubmitForm)}
                        >Send</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}