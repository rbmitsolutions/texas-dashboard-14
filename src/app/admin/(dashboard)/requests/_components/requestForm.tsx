import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";

//components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Wrap from "@/components/common/wrap";

//hooks
import { IPOSTUserBody } from "@/hooks/user/IPostUserDataHooks.interface";

//libs
import { RequestFormSchema, RequestFormSchemaType } from "@/common/libs/zod/forms/company/companyRequest";
import { addDaysToDate, formatDate } from "@/common/libs/date-fns/dateFormat";
import { IRequests, IRequestsType } from "@/common/types/company/requests.interface";

interface RequestFormProps {
    createRequest: UseMutateFunction<IRequests, any, IPOSTUserBody, unknown>
    isCreateRequestLoading: boolean
}
export default function RequestForm({ createRequest, isCreateRequestLoading }: RequestFormProps) {
    const [dates, setDates] = useState<string[]>([]);
    const [preRendered, setPreRendered] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
    const form = useForm<RequestFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(RequestFormSchema),
        defaultValues: {
            message: "",
            type: 'Message'
        },
    });

    const handleSelectDaysOff = (date: Date) => {
        const dateStr = formatDate({ date, f: "yyyy-MM-dd" })
        setDates(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr)
            }
            return [...prev, dateStr]
        })
    }

    const handleSelectRange = (date: Date) => {
        const dateStr = formatDate({ date, f: "yyyy-MM-dd" })

        const [from, to] = dates?.map(date => new Date(date)) || []

        if (from && to) {
            setDates([dateStr])
            return
        }

        if (from) {
            if (new Date(dateStr) < from) {
                setDates([dateStr, formatDate({ date: from, f: "yyyy-MM-dd" })])
                return
            }
            setDates([formatDate({ date: from, f: "yyyy-MM-dd" }), dateStr])
            return
        }

        if (to) {
            if (new Date(dateStr) > to) {
                setDates([formatDate({ date: to, f: "yyyy-MM-dd" }), dateStr])
                return
            }
            setDates([dateStr, formatDate({ date: to, f: "yyyy-MM-dd" })])
            return
        }

        setDates([dateStr])
    }


    const onSubmitForm: SubmitHandler<RequestFormSchemaType> = async (formData) => {
        await createRequest({
            request: {
                type: formData.type as IRequestsType,
                message: formData.message,
                dates_off: dates?.join("/"),
            }
        }, {
            onSuccess: async () => {
                await form.reset({
                    message: "",
                    type: 'Message'
                })
                setDates([])
            }
        })


    };


    useEffect(() => {
        setPreRendered(true);
    }, [])

    useEffect(() => {
        setDates([])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('type')])



    if (!preRendered) {
        return <RequestForm.Skeleton />;
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'New Request',
                    icon: 'MessageCircleMore'
                }

            }}
            className='p-4 mt-[-200px] w-full max-w-[85vw] z-10 rounded-xl bg-background shadow-xl md:max-w-[450px]  border-[1px]'
        >

            <Form {...form}>
                <form
                    onChange={() => submitError && setSubmitError("")}
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className='flex-col-container gap-6'
                >
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field?.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Request Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.keys(IRequestsType).map(key => {
                                            return (
                                                <SelectItem key={key} value={key}>{key}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.watch('type') !== 'Message' &&
                        <div className='flex justify-center w-full'>
                            <div className='flex-col-container-center gap-4'>
                                {form.watch('type') === 'Day Off' ?
                                    <Calendar
                                        mode="multiple"
                                        selected={dates?.map(date => new Date(date))}
                                        onDayClick={date => handleSelectDaysOff(date)}
                                        initialFocus
                                        fromDate={addDaysToDate(new Date(), 7)}
                                        toDate={addDaysToDate(new Date(), 180)}

                                    />
                                    :
                                    <Calendar
                                        mode="range"
                                        selected={{
                                            from: dates?.map(date => new Date(date))[0],
                                            to: dates?.map(date => new Date(date))[1]
                                        }}
                                        onDayClick={date => handleSelectRange(date)}
                                        initialFocus
                                        fromDate={addDaysToDate(new Date(), 7)}
                                        toDate={addDaysToDate(new Date(), 180)}

                                    />
                                }
                            </div>
                        </div>
                    }
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Message'
                                        className='h-40'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className='w-full'
                        leftIcon='Send'
                        isLoading={isCreateRequestLoading}
                        type="submit"
                        disabled={isCreateRequestLoading}
                    >
                        Send
                    </Button>
                </form>
            </Form>
        </Wrap>
    )
}

RequestForm.Skeleton = function SignInformSkeleton() {
    return (
        <Skeleton className="w-full  mt-[-200px] z-20 max-w-[450px] h-48" />
    )
}