import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

//libs

//components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

//interface
import { IConditionalGroupRadiosForm, IConditionalSelectForm } from "@/common/utils/formBuilder/formBuilder.interface";
import { IFormBuildInput } from "@/common/utils/formBuilder";
import AddNewOption from "./utils/addNewOption";
import { FormRadioGroupBuilderFormSchema, FormRadioGroupBuilderFormSchemaType } from "@/common/libs/zod/forms/company/companyFormRadioGroupBuilder";

export interface RadioGroupUpdateFormType extends UseFormReturn<FormRadioGroupBuilderFormSchemaType> { }


interface RadioGroupUpdateProps {
    field: IConditionalGroupRadiosForm
    onSave: (field: IFormBuildInput) => void
}

export default function RadioGroupUpdate({ field, onSave }: RadioGroupUpdateProps) {
    const form = useForm<FormRadioGroupBuilderFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(FormRadioGroupBuilderFormSchema),
        defaultValues: {
            label: field?.label,
            description: field?.description,
            required: field?.required,
            options: field?.options?.map(option => option.value) || []
        },
    });

    const onSubmitForm: SubmitHandler<FormRadioGroupBuilderFormSchemaType> = (formData) => {
        onSave({
            ...field,
            label: formData.label,
            description: formData.description,
            required: formData.required,
            options: formData.options.map(option => ({ 
                label: option?.toLowerCase(),
                value: option?.toLowerCase()
             }))
        })
        form.reset()
    };

    useEffect(() => {
        form.reset({
            label: field?.label,
            description: field?.description,
            required: field?.required,
            options: field?.options?.map(option => option.value) || []
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
                        form.setValue('options', [...options, option])
                    }}
                    onRemove={(option) => {
                        const options = form.getValues('options')
                        form.setValue('options', options.filter(opt => opt !== option))
                    }}
                />
                <Button
                    className='mt-4 self-end'
                    leftIcon='Save'
                >Update </Button>
            </form>
        </Form>
    )
}
