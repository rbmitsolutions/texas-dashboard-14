import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

//libs
import { FormSelectBuilderFormSchema, FormSelectBuilderFormSchemaType } from "@/common/libs/zod/forms/company/companyFormSelectBuilder";

//components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import AddNewOption from "./utils/addNewOption";
import { Input } from "@/components/ui/input";

//interface
import { IConditionalSelectForm } from "@/common/utils/formBuilder/formBuilder.interface";
import { IFormBuildInput } from "@/common/utils/formBuilder";

export interface SelectUpdateFormType extends UseFormReturn<FormSelectBuilderFormSchemaType> { }


interface SelectUpdateProps {
    field: IConditionalSelectForm
    onSave: (field: IFormBuildInput) => void
}

export default function SelectUpdate({ field, onSave }: SelectUpdateProps) {
    const form = useForm<FormSelectBuilderFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(FormSelectBuilderFormSchema),
        defaultValues: {
            label: field?.label,
            description: field?.description,
            required: field?.required,
            options: field?.options?.map(o => o.options?.map(op => op.value)).flat() || []
        },
    });

    const onSubmitForm: SubmitHandler<FormSelectBuilderFormSchemaType> = (formData) => {
        onSave({
            ...field,
            label: formData.label,
            description: formData.description,
            required: formData.required,
            options:[{
                isOptionGroup: false,
                label: formData.label,
                options: formData.options.map(o => ({ label: o, value: o }))
            }]
        })
        form.reset()
    };

    useEffect(() => {
        form.reset({
            label: field?.label,
            description: field?.description,
            required: field?.required,
            options: field?.options?.map(o => o.options?.map(op => op.value)).flat() || []
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
                <AddNewOption
                    form={form}
                    onSave={(option) => {
                        const options = form.getValues('options')
                        const sortedOptions = [...options, option].sort()
                        form.setValue('options', sortedOptions)
                    }}
                    onRemove={(option) => {
                        const options = form.getValues('options')
                        form.setValue('options', options.filter(opt => opt !== option))
                    }}
                />
                <small>You have to add a minimum of two options</small>
                <Button
                    className='mt-4 self-end'
                    leftIcon='Save'
                >
                    Update
                </Button>
            </form>
        </Form>
    )
}
