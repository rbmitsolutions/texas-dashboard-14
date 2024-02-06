import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

//libs
import { FormInputBuilderFormSchema, FormInputBuilderFormSchemaType } from "@/common/libs/zod/forms/company/companyFormInputBuilder";

//components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interface
import { IConditionalInputForm } from "@/common/utils/formBuilder/formBuilder.interface";
import { IFormBuildInput } from "@/common/utils/formBuilder";
import { Switch } from "@/components/ui/switch";

interface InputUpdateProps {
    field: IConditionalInputForm
    onSave: (field: IFormBuildInput) => void
}

export default function InputUpdate({ field, onSave }: InputUpdateProps) {
    const form = useForm<FormInputBuilderFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(FormInputBuilderFormSchema),
        defaultValues: {
            label: field?.label,
            description: field?.description,
            required: field?.required,
            type: field?.propsUi?.type || 'text'
        },
    });

    const onSubmitForm: SubmitHandler<FormInputBuilderFormSchemaType> = (formData) => {
        onSave({
            ...field,
            label: formData.label,
            description: formData.description,
            required: formData.required,
            propsUi: {
                type: formData.type
            }
        })
        form.reset()
    };

    useEffect(() => {
        form.reset({
            label: field?.label,
            description: field?.description,
            required: field?.required,
            type: field?.propsUi?.type || 'text'
        })
    }, [field, form])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className='flex-col-container gap-4'>
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input placeholder="label" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background-soft">
                            <div className="space-y-0.5 mr-1">
                                <FormLabel>Mandatory</FormLabel>
                                <FormDescription>
                                    Checking this will make this field mandatory
                                </FormDescription>
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
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Input Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[{
                                        label: 'Text',
                                        value: 'text'
                                    }, {
                                        label: 'Number',
                                        value: 'number'
                                    }, {
                                        label: 'Date',
                                        value: 'date'
                                    }, {
                                        label: 'Time',
                                        value: 'time'
                                    }, {
                                        label: 'Date / Time',
                                        value: 'datetime-local'
                                    }].map(item => {
                                        return (
                                            <SelectItem key={item?.label} value={item.value}>{item.label}</SelectItem>
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none h-40"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className='mt-4 self-end'
                    leftIcon='Save'
                >Update </Button>
            </form>
        </Form>
    )
}
