import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from 'react-query';

//components
import { CreateFormFormSchema, CreateFormFormSchemaType } from '@/common/libs/zod/forms/company/companyCreateForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SortbleField from "./sortbleField"

//hooks
import { useAuthHooks } from '@/hooks/useAuthHooks';

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from '@/hooks/company/IPostCompanyDataHooks.interface';
import { IForm, IFormSection } from "@/common/types/company/form.interface"
import { IFormBuildInput } from "@/common/utils/formBuilder"
import { useEffect } from 'react';
import { IPUTCompanyBody } from '@/hooks/company/IPutCompanyDataHooks.interface';

interface RenderFormProps {
    inputs: IFormBuildInput[][]
    setInputs: React.Dispatch<React.SetStateAction<IFormBuildInput[][]>>
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    setField: React.Dispatch<React.SetStateAction<IFormBuildInput>>
    deleteField: (field: IFormBuildInput) => void
    replaceInputs: (page: number, inputs: IFormBuildInput[]) => void
    removePage: () => void
    formSections: IFormSection[]
    createForm?: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    updateForm?: {
        updateForm: UseMutateFunction<any, any, IPUTCompanyBody, unknown>,
        form: IForm
    }
}

export default function RenderForm({ inputs, setInputs, page, setPage, setField, replaceInputs, deleteField, removePage, formSections, createForm, updateForm }: RenderFormProps) {
    const { user } = useAuthHooks()

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over.id) {
            const i = inputs[page]
            const activeIndex = i.findIndex(input => input.register === active.id)
            const overIndex = i.findIndex(input => input.register === over.id)
            const temp = i[activeIndex]
            i[activeIndex] = i[overIndex]
            i[overIndex] = temp
            replaceInputs(page, i)
        }
    }

    const f = useForm<CreateFormFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateFormFormSchema),
        defaultValues: {
            form_section_id: updateForm?.form?.form_section_id || '',
            title: updateForm?.form?.title || '',
        },
    });

    const onSubmitForm: SubmitHandler<CreateFormFormSchemaType> = async (formData) => {
        const fields = inputs?.filter(input => input?.length > 0)
        const form = {
            inputs: fields,
            title: formData?.title,
            form_section_id: formData?.form_section_id === 'none' ? undefined : formData?.form_section_id,
            created_by: user?.name,
            created_by_id: user?.user_id
        }
        createForm && await createForm({
            form
        }, {
            onSuccess: () => {
                localStorage.removeItem('formInputs')
                f.reset()
                setPage(0)
                setInputs([[]] as IForm['inputs'])
            }
        })

        updateForm && updateForm.updateForm({
            form: {
                ...updateForm.form,
                id: updateForm.form.id,
                inputs: fields,
                title: formData?.title,
                form_section_id: formData?.form_section_id === 'none' ? undefined : formData?.form_section_id,
            }
        })
    };

    useEffect(() => {
        if (updateForm?.form) {
            f.reset({
                form_section_id: updateForm?.form?.form_section_id || undefined,
                title: updateForm?.form?.title
            })
        }
    }, [f, updateForm, formSections])

    return (
        <div className='p-2 rounded-xl bg-background-soft'>
            <Form {...f}>
                <form
                    onSubmit={f.handleSubmit(onSubmitForm)}
                    className='pb-8'
                >
                    <div className='flex items-center justify-center relative h-48 border-2 p-4 rounded-xl bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover z-10 '>
                        <Button
                            variant='destructive'
                            disabled={(inputs.length === 1 && page === 0)}
                            leftIcon='Minus'
                            className='absolute top-2 right-2'
                            type='button'
                            onClick={removePage}
                        >
                            Delete Page
                        </Button>
                        <h1 className='text-2xl font-bold bg-background p-2 rounded-xl text-primary dark:text-white'>{f?.watch('title')}</h1>
                    </div>
                    <div className='flex-col-container relative bg-background shadow-lg min-h-20 p-4 max-w-lg m-auto mt-[-40px] rounded-lg z-10'>
                        <div className='grid grid-cols-[1fr,150px] gap-4'>
                            <FormField
                                control={f.control}
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
                                control={f.control}
                                name="form_section_id"
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
                                                    <SelectValue placeholder="Select Section" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='none'>No Section</SelectItem>
                                                {formSections?.map(sec => {
                                                    return (
                                                        <SelectItem key={sec?.id} value={sec?.id}>{sec?.title}</SelectItem>
                                                    )
                                                })}

                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {inputs[page]?.length > 0 &&
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={inputs[page]?.map(input => input?.register)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {inputs[page]?.map(input => {
                                        return (
                                            <SortbleField
                                                key={input?.register}
                                                form={f}
                                                input={input}
                                                deleteField={deleteField}
                                                setField={setField}
                                            />
                                        )
                                    })}
                                </SortableContext>
                            </DndContext>
                        }
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                {inputs.length > 1 &&
                                    Array.from({ length: inputs.length }, (_, i) => {
                                        return (
                                            <Button
                                                key={i}
                                                type='button'
                                                variant='secondary'
                                                size='iconSm'
                                                onClick={() => setPage(i)}
                                                className={`${page === i ? 'bg-primary text-white' : 'bg-background-soft'} rounded-md`}
                                            >
                                                {i + 1}
                                            </Button>
                                        )
                                    })
                                }
                            </div>
                            <Button
                                leftIcon='Save'
                                className='self-end'
                                disabled={inputs?.length === 1 && inputs[0]?.length === 0}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}