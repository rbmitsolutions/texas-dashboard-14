import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

//libs
import { CompanyDocumentFormSchema, CompanyDocumentFormSchemaType } from "@/common/libs/zod/forms/company/companyDocumentForm";
import Icon from "@/common/libs/lucida-icon";

//components
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

//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";


interface CreateDocumentFormProps {
    createDocument: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    isLoading: boolean
}

export default function CreateDocumentForm({ createDocument, isLoading }: CreateDocumentFormProps) {
    const [uploading, setUploading] = useState<boolean>(false);
    const form = useForm<CompanyDocumentFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CompanyDocumentFormSchema),
        defaultValues: {
            title: '',
            file: '',
        },
    });

    const createPreviewFile = async (e: any) => {
        setUploading(true);
        const objectFile = new FormData();
        const finishedFile = e.target.files[0];
        objectFile.append("file", finishedFile);
        const reader = new FileReader();

        if (finishedFile) {
            reader.readAsDataURL(finishedFile); 
            reader.onloadend = () => {
                const base64String = reader.result;
                form.setValue('file', base64String as string)
                setUploading(false);
            };
        } else {
            setUploading(false);
        }
    };

    const onSubmitForm: SubmitHandler<CompanyDocumentFormSchemaType> = async (formData) => {
        await createDocument({
            document: {
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
                    Document
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex-col-container w-auto max-w-64" align="start">
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
                        <div className='flex justify-between border-1 rounded-xl p-2 bg-background-soft gap-2'>
                            <label className='w-full'>
                                {form.watch('file') ?
                                    <strong className='text-green-500'>Uploaded</strong>
                                    :
                                    <strong className='text-red-500'>Upload File</strong>
                                }
                                <input type="file" accept=".pdf" onChange={createPreviewFile} hidden />
                            </label>
                            {form.watch('file') &&
                                <Button
                                    size='iconExSm'
                                    variant='destructive'
                                    onClick={() => form.setValue('file', '')}
                                >
                                    <Icon name='Trash' />
                                </Button>
                            }
                        </div>

                        <Button
                            type='submit'
                            leftIcon="Plus"
                            size='sm'
                            disabled={isLoading || uploading}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}