import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//libs
import { CompanyContactsFormSchema, CompanyContactsFormSchemaType } from "@/common/libs/zod/forms/company/companyContactsForm";

//components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { CompanyLinkFormSchema, CompanyLinkFormSchemaType } from "@/common/libs/zod/forms/company/companyLinkForm";


interface CreateLinkFormProps {
    createLink: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    isLoading: boolean
    sections: string[]
}

export default function CreateLinkForm({ createLink, isLoading, sections }: CreateLinkFormProps) {

    const form = useForm<CompanyLinkFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CompanyLinkFormSchema),
        defaultValues: {
            link: '',
            section: '',
            title: '',
            description: '',
        },
    });

    const onSubmitForm: SubmitHandler<CompanyLinkFormSchemaType> = async (formData) => {
        await createLink({
            link: {
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
                    Link
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
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Link" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="section"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Section" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sections.map((section, index) => (
                                                <SelectItem key={index} value={section}>{section}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                            placeholder="Description"
                                            className='resize-none h-24'
                                            {...field} />
                                    </FormControl>
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