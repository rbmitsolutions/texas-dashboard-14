import { UseMutateFunction } from "react-query"
    ;
//libs
import { CreateRosterFormSchema, CreateRosterFormSchemaType } from "@/common/libs/zod/forms/company/companyRosterForm";
import { rosterBackground } from "@/common/libs/company/roster";
import { parseDate, subDaysToDate } from "@/common/libs/date-fns/dateFormat";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon"
import toast from "react-hot-toast";

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import RosterTasksDisplay from "../rosterTasksDisplay";
import AddTaskToRoster from "../addTaskToRoster";
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch";

//utils
import { generateRoster } from "./utils";

//hooks
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn, IPOSTRosterBody } from "@/hooks/company/IPostCompanyDataHooks.interface";

//interface
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface";
import { IUser } from "@/common/types/user/user.interface";
import { IWeekDays } from "..";
import { IForm } from "@/common/types/company/form.interface";

interface AddToRosterProps {
    user: IUser;
    weekDays: IWeekDays
    shifts: IShifts[],
    duties: IDuties[]
    forms: IForm[]
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    createRoster: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRoster: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function AddToRoster({
    user,
    weekDays,
    shifts,
    duties,
    deleteRoster,
    createRoster,
    forms,
    createRosterTask,
    deleteRosterTask
}: AddToRosterProps) {
    const form = useForm<CreateRosterFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateRosterFormSchema),
        defaultValues: {
            shift: '',
            duty: '',
            is_dayoff: false,
        },
    });


    const onSubmitForm: SubmitHandler<CreateRosterFormSchemaType> = async (formData, date: any) => {
        if (
            (user?.fixed_salary === true && user?.salary === null) ||
            (user?.fixed_salary === false && user?.rate_per_hour === null) ||
            (user?.fixed_salary === false && user?.rate_per_hour_weekend === null)
        ) {
            return toast.error("Update user payment details first!");
        }

        if (formData?.is_dayoff === false && (formData?.duty === '' || formData?.shift === '')) {
            toast.error('Please select a duty and shift')
            return
        }

        const postRosterData = generateRoster({
            user,
            shift: shifts?.find(shift => shift?.id === formData?.shift)!,
            date,
            formData,
        })
        await handleCreateRoster(postRosterData)
    };


    const handleCreateRoster = async (data: IPOSTRosterBody) => {
        await createRoster({
            roster: data
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size='iconExSm'
                    variant='outline'
                >
                    <Icon name="Plus" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
                <SheetHeader>
                    <SheetTitle>{user?.name}</SheetTitle>
                </SheetHeader>
                <div className='overflow-auto scrollbar-thin'>
                    <Form {...form} >
                        <form
                            onSubmit={form.handleSubmit(onSubmitForm)}
                            className="flex-col-container gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="is_dayoff"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Day Off</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={() => {
                                                    field.onChange(!field.value)
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duty</FormLabel>
                                        <Select
                                            disabled={form.watch('is_dayoff')}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Duty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {duties?.map(duty => {
                                                    return (
                                                        <SelectItem key={duty?.id} value={duty?.title}>{duty?.title}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shift"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shift</FormLabel>
                                        <Select
                                            disabled={form.watch('is_dayoff')}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Shift" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {shifts?.map(shift => {
                                                    return (
                                                        <SelectItem key={shift?.id} value={shift?.id}>{shift?.title}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {weekDays?.map(date => {
                                return (
                                    <div key={date?.date} className="flex flex-col gap-2 border-b-[1px] pb-2">
                                        <div className='flex justify-between items-center'>
                                            <div className='flex items-center'>
                                                <strong className='text-sm text-primary'>{date?.day}</strong>
                                                <small className='text-xs text-foreground/40 ml-1'>{date?.date}</small>
                                            </div>
                                            <Button
                                                size='iconExSm'
                                                type='submit'
                                                onClick={form.handleSubmit(data => onSubmitForm(data, date as any))}
                                                disabled={parseDate(date?.date, 'dd/MM/yy') < subDaysToDate(new Date(), 1)}
                                            >
                                                <Icon name="Plus" />
                                            </Button>
                                        </div>
                                        <div>
                                            {user?.roster?.map(roster => {
                                                if (roster?.week_day === date?.day) {
                                                    return (
                                                        <div key={roster?.id} className={cn('flex flex-col gap-1 p-2 rounded-md mt-1', rosterBackground(roster?.status!, true))}>
                                                            <div className='flex justify-between'>
                                                                <div className='flex flex-col'>
                                                                    <small className='text-xs'>{roster?.shift}</small>
                                                                    <small className='text-xs'>{roster?.duty}</small>
                                                                </div>
                                                                <div className='flex gap-2'>
                                                                    <AddTaskToRoster
                                                                        roster={roster}
                                                                        forms={forms}
                                                                        createRosterTask={createRosterTask}
                                                                    />
                                                                    <Button
                                                                        className='h-4 w-4 p-1'
                                                                        variant='destructive'
                                                                        type='button'
                                                                        disabled={new Date(roster?.date!) < new Date()}
                                                                        onClick={async () => {
                                                                            await deleteRoster({
                                                                                roster: {
                                                                                    id: roster?.id
                                                                                }
                                                                            })
                                                                        }}
                                                                    >
                                                                        <Icon name="X" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {roster?.tasks?.map(task => {
                                                                return (
                                                                    <RosterTasksDisplay
                                                                        key={task?.id}
                                                                        task={task}
                                                                        deleteRosterTask={deleteRosterTask}
                                                                    />
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </form>
                    </Form>

                </div>
            </SheetContent>
        </Sheet>
    )
}