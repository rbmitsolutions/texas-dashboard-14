import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//libs
import { DutyFormSchema, DutyFormSchemaType } from "@/common/libs/zod/forms/company/companyDutyForm";

//components
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IDepartments } from "@/common/types/company/departaments.interface";


interface CreateDutyFormProps {
    createDuty: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    departaments: IDepartments[]
    isLoading: boolean
}

export default function CreateDutyForm({ createDuty, isLoading, departaments }: CreateDutyFormProps) {

    const form = useForm<DutyFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(DutyFormSchema),
        defaultValues: {
            departament_id: '',
            title: ''
        },
    });

    const onSubmitForm: SubmitHandler<DutyFormSchemaType> = async (formData) => {
        await createDuty({
            duty: {
                ...formData
            }
        }, {
            onSuccess: () => {
                form.reset()
            }
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    leftIcon="Plus"
                    size='sm'
                    variant='orange'
                >
                    Duty
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex-col-container w-auto" align="start">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className='flex-col-container w-auto'
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="departament_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departaments?.map(d => {
                                                return (
                                                    <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            leftIcon="Plus"
                            size='sm'
                            disabled={isLoading}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}