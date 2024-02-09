'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/common/libs/shadcn/utils";
import { CalendarIcon } from "lucide-react";
import SignaturePad from "react-signature-canvas";

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//components
import { CompanyHireFormSchema, CompanyHireFormSchemaType } from "@/common/libs/zod/forms/company/companyHireForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createHireContract } from "@/common/libs/pdf-lib/contract";
import IconText from "@/components/common/iconText";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

//interface
import { IRoles } from "@/common/types/company/companyDetails.interface";

import { useRef } from "react";
import Icon from "@/common/libs/lucida-icon";
import { usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

interface HireFormProps {
    roles: IRoles[]
}
export default function HireForm({ roles }: HireFormProps): JSX.Element {
    const sigCanvas = useRef(null);

    const {
        createCompanyData: hireEmployee,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'AUTH',
    })
    const form = useForm<CompanyHireFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CompanyHireFormSchema),
        defaultValues: {
            name: "",
            email: "",
            commencement_date: new Date(),
            employment_status: "",
            fixed_salary: false,
            issue_date: new Date(),
            manager_name: "Michael Ryan",
            normal_working_hours: "",
            place_of_work: "Texas Steakout",
            rate_per_hour: 0,
            rate_per_hour_weekend: 0,
            role_id: "",
            salary: 0,
            visa_needed: false,
        },
    });

    const formatIntoPng = () => {
        if (sigCanvas.current) {
            const dataURL = (sigCanvas.current as any).toDataURL();
            return dataURL;
        }
    };

    const onSubmitForm: SubmitHandler<CompanyHireFormSchemaType> = async (formData) => {
        const role = roles.find(role => role.id === formData.role_id)

        if (!role) return

        const contract = await createHireContract(formData, role?.title)

        await hireEmployee({
            signUp: {
                contract,
                commencement_date: formData.commencement_date,
                email: formData.email,
                fixed_salary: formData.fixed_salary,
                name: formData.name,
                rate_per_hour: formData.rate_per_hour || 0,
                rate_per_hour_weekend: formData.rate_per_hour_weekend || 0,
                role_id: formData.role_id,
                salary: formData.salary || 0,
                visa_needed: formData.visa_needed,
            }
        }, {
            onSuccess: () => {
                (sigCanvas.current as any).clear()
                form.reset()
            }
        })
    };


    return (
        <div className='flex-col-container-center'>
            <div className='flex-col-container justify-center items-center h-80 border-2 p-4 rounded-xl w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:opacity-60 dark:grayscale' />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmitForm)}
                    className='flex-col-container gap-6 p-4 w-[90%] max-w-2xl min-w-[280px] mt-[-240px] z-10 min-h-80 rounded-2xl border-2 shadow-lg bg-background'>
                    <IconText icon="User" text="Hire" />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" type='email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="commencement_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel>Employment Commencement Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal bg-background-soft",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate({
                                                        date: field.value,
                                                        f: 'PPP'
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
                        name="issue_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel>Issue Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal bg-background-soft",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate({
                                                        date: field.value,
                                                        f: 'PPP'
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
                        name="manager_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Managers Name:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Manager" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="place_of_work"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Place of Work:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Place of Work" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="employment_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employment Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Employment Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["Full Time",
                                            "Part Time",
                                            "Temporary",
                                            "Casual",
                                            "Fixed Term",
                                            "Training"].map(item => {
                                                return <SelectItem key={item} value={item}>{item}</SelectItem>
                                            })}
                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="normal_working_hours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Working Hours</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Working Hours" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["5 - 15 Hours Per Week",
                                            "10 - 25 Hours Per Week",
                                            "20 - 40 Hours Per Week",
                                            "Full Time Hours"].map(item => {
                                                return <SelectItem key={item} value={item}>{item}</SelectItem>
                                            })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fixed_salary"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-40 bg-background-soft">
                                <div className="space-y-0.5">
                                    <FormLabel>Fixed Salary</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div>
                        {form.watch('fixed_salary') ?
                            <FormField
                                control={form.control}
                                name="salary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salary</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Salary"
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            :
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name="rate_per_hour"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rate per Hour</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Rate per Hour"
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rate_per_hour_weekend"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sunday Rate</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Sunday Rate"
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        }
                    </div>

                    <FormField
                        control={form.control}
                        name="role_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles?.map(item => {
                                            return <SelectItem className='capitalize' key={item?.id} value={item?.id}>{item?.title.toLocaleLowerCase()}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="visa_needed"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-40 bg-background-soft">
                                <div className="space-y-0.5">
                                    <FormLabel>Visa Needed</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className='flex flex-col items-center md:hidden'>
                        <FormField
                            control={form.control}
                            name="signature"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between items-center'>
                                        Signature
                                        <Button
                                            variant='destructive'
                                            type='button'
                                            size='iconExSm'
                                            onClick={() => {
                                                (sigCanvas.current as any).clear()
                                                field.onChange('')
                                            }}
                                        >
                                            <Icon name='Trash' />
                                        </Button>
                                    </FormLabel>
                                    <FormControl >
                                        <div className='rounded-2xl background-soft dark:bg-foreground/20'>
                                            <SignaturePad
                                                ref={sigCanvas}
                                                onEnd={() => field.onChange(formatIntoPng())}
                                                penColor="black"
                                                canvasProps={{
                                                    width: 280,
                                                    height: 200,
                                                    style: { border: "1px solid", borderRadius: "20px" },
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='hidden flex-col items-center md:flex'>
                        <FormField
                            control={form.control}
                            name="signature"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between items-center'>
                                        Signature
                                        <Button
                                            variant='destructive'
                                            type='button'
                                            size='iconExSm'
                                            onClick={() => {
                                                (sigCanvas.current as any).clear()
                                                field.onChange('')
                                            }}
                                        >
                                            <Icon name='Trash' />
                                        </Button>
                                    </FormLabel>
                                    <FormControl >
                                        <div className='rounded-2xl background-soft dark:bg-foreground/20'>
                                            <SignaturePad
                                                ref={sigCanvas}
                                                onEnd={() => field.onChange(formatIntoPng())}
                                                penColor="black"
                                                canvasProps={{
                                                    width: 450,
                                                    height: 200,
                                                    style: { border: "1px solid", borderRadius: "20px" },
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type='submit'
                        leftIcon='User'
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Hire
                    </Button>
                </form>
            </Form>
        </div>
    )
}