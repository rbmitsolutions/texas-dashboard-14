import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

//libs
import { FormTextareaBuilderFormSchema, FormTextareaBuilderFormSchemaType } from "@/common/libs/zod/forms/company/companyFormTextareaBuilder";

//components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interface
import { IConditionalTextareaForm } from "@/common/utils/formBuilder/formBuilder.interface";
import { IFormBuildInput } from "@/common/utils/formBuilder";
import { Switch } from "@/components/ui/switch";

interface TextareaUpdateProps {
    field: IConditionalTextareaForm
    onSave: (field: IFormBuildInput) => void
}

export default function TextareaUpdate({ field, onSave }: TextareaUpdateProps) {
    const form = useForm<FormTextareaBuilderFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(FormTextareaBuilderFormSchema),
        defaultValues: {
            label: field?.label,
            description: field?.description,
            required: field?.required,
        },
    });

    const onSubmitForm: SubmitHandler<FormTextareaBuilderFormSchemaType> = (formData) => {
        onSave({
            ...field,
            label: formData.label,
            description: formData.description,
            required: formData.required,
        })
        form.reset()
    };

    useEffect(() => {
        form.reset({
            label: field?.label,
            description: field?.description,
            required: field?.required,
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
                <Button
                    className='mt-4 self-end'
                    leftIcon='Save'
                >Update </Button>
            </form>
        </Form>
    )
}
