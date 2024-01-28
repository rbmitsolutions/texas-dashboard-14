'use client'
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";

//components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormSelectComponent } from "./formSelectComponent";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//libs
import { ReportsFormSchema, ReportsFormSchemaType } from "@/common/libs/zod/forms/company/companyReports";
import { formatDate, getFirstTimeOfTheDay, getLastTimeOfTheDay, subDaysToDate } from "@/common/libs/date-fns/dateFormat";
import { cn } from "@/common/libs/shadcn/utils";

//hooks
import { usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interfaces
import { IForm, IFormSection } from "@/common/types/company/form.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";

interface CreateReportsFormProps {
    forms: IForm[]
    formSections: IFormSection[]
}

export default function CreateReportsForm({ forms, formSections }: CreateReportsFormProps) {
    const { user } = useAuthHooks()
    const [haccpReport, setHaccpReport] = useState<IHaccpReports>({} as IHaccpReports)
    const [submitError, setSubmitError] = useState<string>("");
    const [preRendered, setPreRendered] = useState<boolean>(false);
    const { createCompanyData: createReport, isCreateCompanyDataLoading: isCreateReportLoading } = usePOSTCompanyDataHooks({
        query: 'HACCP_REPORTS',
    })
    const form = useForm<ReportsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(ReportsFormSchema),
        defaultValues: {
            title: '',
            description: '',
            from: undefined,
            to: undefined,
            reports: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: 'reports',
        control: form.control,
    })

    const handleCreateReport: SubmitHandler<ReportsFormSchemaType> = async (data) => {
        await createReport({
            haccpReport: {
                created_by: user?.name,
                created_by_id: user?.user_id,
                date: {
                    gte: getFirstTimeOfTheDay(data?.from),
                    lte: getLastTimeOfTheDay(data?.to)
                },
                reports: data?.reports,
                title: data?.title,
                description: data?.description
            }
        }, {
            onSuccess: (data) => {
                setHaccpReport(data as IHaccpReports)
            },
            onError: (err) => {
                console.log(err)
            }
        })
    }

    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <CreateReportsForm.Skeleton />;
    }


    return (
        <Form {...form}>
            <form
                onChange={() => submitError && setSubmitError("")}
                onSubmit={form.handleSubmit(handleCreateReport)}
                className='flex-col-container gap-4'
            >
                <div className='flex-container-center gap-4'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage src={user?.profile_image} alt={user?.name} />
                        <AvatarFallback>
                            {user && user?.name?.split('')[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                </div>
                <FormField
                    control={form.control}
                    name="title"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    type="title"
                                    placeholder='Title'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Description'
                                    className='h-40'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='grid-container grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>From</FormLabel>
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
                                                        date: field.value,
                                                        f: 'LLL dd, yy'
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
                                            fromDate={subDaysToDate(new Date(), 120)}
                                            selected={field.value}
                                            onSelect={x => {
                                                field.onChange(x)
                                                form.setValue('to', field.value)
                                            }}
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
                    <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>To</FormLabel>
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
                                                        date: field.value,
                                                        f: 'LLL dd, yy'
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
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={() => !form.watch('from')}
                                            fromDate={new Date(form.watch('from'))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex-col-container gap-4'>
                    {forms?.filter(f => f.form_section_id === null)?.map(f => {
                        return (
                            <FormSelectComponent key={f.id} append={append} fields={fields} form={f} formState={form} remove={remove} />
                        )
                    })}
                </div>
                {formSections?.filter(s => s?.forms?.length > 0)?.map(section => {
                    return (
                        <div className='flex-col-container gap-4' key={section?.id}>
                            <h2 >
                                {section?.title}
                            </h2>
                            <div className='flex-col-container gap-4'>
                                {section?.forms?.map(f => {
                                    return (
                                        <FormSelectComponent key={f.id} append={append} fields={fields} form={f} formState={form} remove={remove} />
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                <Button
                    type='submit'
                    variant={fields?.length > 0 ? 'default' : 'destructive'}
                    className='mt-4'
                    leftIcon='AlertTriangle'
                    disabled={isCreateReportLoading || fields?.length === 0}
                >
                    {fields?.length > 0 ? 'Create' : 'Select one or more forms to create a report'}
                </Button>
            </form>
        </Form>
    )
}

CreateReportsForm.Skeleton = function SignInformSkeleton() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Skeleton className="w-20 h-14" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-9 mt-8" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9 mt-14" />
        </div>
    )
}