import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseMutateFunction } from "react-query"

//components
import {
    Form,
    FormControl,
    FormDescription,
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
import { Button } from "@/components/ui/button"

//libs
import { UpdateRosterFormSchema, UpdateRosterFormSchemaType } from "@/common/libs/zod/forms/company/companyUpdateRoster"

//interface
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import { generateRoster } from "../addToRoster/utils"
import { IUser } from "@/common/types/user/user.interface"
import { IRoster } from "@/common/types/company/roster.interface"

interface UpdateRosterProps {
    shifts: IShifts[]
    duties: IDuties[]
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    user: IUser
    roster: IRoster
}
export default function UpdateRoster({
    shifts,
    duties,
    user,
    roster,
    updateRoster
}: UpdateRosterProps): JSX.Element {

    const form = useForm<UpdateRosterFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(UpdateRosterFormSchema),
        defaultValues: {
            duty: "",
            shift: ""
        },
    });


    const onSubmitForm: SubmitHandler<UpdateRosterFormSchemaType> = async (formData) => {
        const generate = generateRoster({
            user,
            shift: shifts?.find(shift => shift?.id === formData?.shift)!,
            date: {
                date: new Date(roster?.date!),
                day: roster?.week_day!
            },
            formData: {
                duty: formData?.duty,
                shift: formData?.shift,
                is_dayoff: false,
            },
        })

        await updateRoster({
            roster:{
                one: {
                    id: roster?.id,
                    ...generate
                }
            }
        })
    };


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className='flex-col-container p-4 bg-background-soft rounded-lg'
            >
                <strong>Update Roster</strong>
                <FormField
                    control={form.control}
                    name="duty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Duty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {duties?.map(d => {
                                        return <SelectItem key={d.id} value={d.title}>{d.title}</SelectItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Shift" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {shifts?.map(s => {
                                        return <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button leftIcon="Save" type='submit'>Save</Button>
            </form>
        </Form>
    )
}