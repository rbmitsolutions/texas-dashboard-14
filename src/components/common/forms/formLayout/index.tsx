'use client'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//components
import { IFormBuildInput, fieldBuilder } from "@/common/utils/formBuilder";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

//interface
import { IForm } from "@/common/types/company/form.interface";

interface IPage {
    page: number
    maxPage: number
}

interface FormLayoutProps {
    form: IForm
    onSubmit: (data: any) => void
    toReset?: boolean
}

export default function FormLayout({ form, onSubmit, toReset = false }: FormLayoutProps): JSX.Element {
    const [page, setPage] = useState<IPage>({
        page: 0,
        maxPage: form?.inputs?.length
    })

    const f = useForm();

    const resetForm = () => {
        f.reset({})
        setPage({
            page: 0,
            maxPage: form?.inputs?.length
        })
    }

    const validateFormAndPagination = async (data: any) => {
        const requiredInputs = form?.inputs[page?.page]?.filter(input => input?.required)
        if (requiredInputs?.length > 0) {
            const isValid = requiredInputs?.every(input => {
                return data[input?.register]
            })
            if (!isValid) {
                requiredInputs?.forEach(input => {
                    if (!data[input?.register]) {
                        f.setError(input?.register, {
                            type: 'required',
                            message: 'This field is required'
                        })
                    }
                })
                return
            }
        }

        if (page?.page < page?.maxPage - 1) {
            setPage(prev => ({ ...prev, page: prev?.page + 1 }))
            return
        }
        
        const values: IFormBuildInput[][] = form?.inputs?.map(inputs => {
            return inputs?.map(input => {
                return {
                    [input?.register as string]: f.watch(input?.register),
                    type: input?.type === 'textarea' ? 'textarea' : 'input',
                    label: input?.label,
                    description: input?.description,
                    propsUi: {
                        value: f.watch(input?.register),
                        isReadOnly: true
                    },
                    register: input?.register,
                    required: true
                }
            })
        })
        onSubmit(values)
    }

    useEffect(() => {
        setPage({
            page: 0,
            maxPage: form?.inputs?.length
        })
    }, [form])

    useEffect(() => {
        resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toReset])

    return (
        <div className='flex flex-col items-center relative'>
            <div className='flex-col-container justify-center items-center h-80 border-2 p-4 rounded-xl w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover  dark:opacity-60 dark:grayscale' />
            <h1 className='absolute top-28 left-[50%] translate-x-[-50%] max-w-xl rounded-lg font-bold text-3xl text-white'>{form?.title}</h1>
            <Form {...f}>
                <form
                    onSubmit={f.handleSubmit(validateFormAndPagination)}
                    className='flex-col-container justify-between gap-6 p-4 w-[90%] max-w-2xl min-w-[280px] mt-[-80px] z-10 min-h-80 rounded-2xl border-2 bg-background shadow-lg'
                >
                    <div className='flex-col-container'>
                        {form?.inputs[page?.page]?.map(input => {
                            return (
                                <div key={input?.register}>
                                    {fieldBuilder(input, f)}
                                </div>
                            )
                        })}
                    </div>
                    {
                        page?.maxPage > 1 ?
                            <div className='grid grid-cols-2 gap-4'>
                                <Button
                                    leftIcon='ArrowLeft'
                                    disabled={page?.page === 0}
                                    type='button'
                                    onClick={() => setPage(prev => ({ ...prev, page: prev?.page - 1 }))}
                                >
                                    Previous
                                </Button>
                                <Button
                                    leftIcon={!page.page && form?.inputs?.length > 1
                                        ? "ArrowRight"
                                        : page.page + 1 === form?.inputs?.length
                                            ? "Send"
                                            : "ArrowRight"}
                                >
                                    {!page.page && form?.inputs?.length > 1
                                        ? "Next"
                                        : page.page + 1 === form?.inputs?.length
                                            ? "Submit"
                                            : "Next"}
                                </Button>
                            </div>
                            : <Button leftIcon="Send" type='submit'>
                                Submit
                            </Button>
                    }

                </form>
            </Form>
        </div>
    )
}