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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"

//libs
import { ComponentsSendSmsSchema, ComponentsSendSmsSchemaType } from "@/common/libs/zod/forms/components/sendSms"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"

//api
import { api } from "@/common/libs/axios/api"
import toast from "react-hot-toast"
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { useAuthHooks } from "@/hooks/useAuthHooks"
import { Permissions } from "@/common/types/auth/auth.interface"

export interface SendSmsContacts {
    id: string;
    name: string;
    contact_number: string;
}

interface SendSmsProps {
    contacts: SendSmsContacts[]
    size?: 'icon' | 'iconSm' | 'iconExSm'
}

//todo: change router in back-end to group message
export default function SendSms({ contacts, size = 'icon' }: SendSmsProps) {
    const { user } = useAuthHooks()
    const form = useForm<ComponentsSendSmsSchemaType>({
        mode: "onChange",
        resolver: zodResolver(ComponentsSendSmsSchema),
        defaultValues: {
            message: ''
        },
    });

    const onOpenChange = () => {
        form.reset()
    }

    const onSubmitForm: SubmitHandler<ComponentsSendSmsSchemaType> = async (formData) => {
        try {
            await api.post(`${EndPointsTypes['SERVICES_SMS_ENDPOINT']}`, {
                data: {
                    messagetext: formData.message,
                    recipients: contacts.map(c => c.contact_number)
                }
            })
            toast.success('Message Sent')
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
                <Button
                    variant="outline"
                    className='p-1'
                    size={size}
                    disabled={!isUserAuthorized(
                        user,
                        [Permissions.SEND_SMS]
                    )}
                >
                    <Icon name="Phone" />
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Sms To</SheetTitle>
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
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder='Message'
                                                    className='w-full h-80'
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