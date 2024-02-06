'use client'
import { useEffect, useState } from "react";

//components
import RenderAddFields from "./_components/renderAddFields";
import UpdateField from "./_components/updateField";
import RenderForm from "./_components/renderForm";

//utils
import { useDebounce } from "@/common/utils/useDebouce";

//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IForm } from "@/common/types/company/form.interface";
import { IFormBuildInput } from "@/common/utils/formBuilder";

export default function CreateFormPage() {
    const [page, setPage] = useState<number>(0)
    const [field, setField] = useState<IFormBuildInput>({} as IFormBuildInput)
    const [form, setForm] = useState<IForm>({
        title: 'Form',
        inputs: [[]] as IForm['inputs'],
    } as IForm)

    const addField = (field: IFormBuildInput) => {
        const formInputsPage = form?.inputs[page]
        formInputsPage.push(field)
        setForm(prev => {
            return {
                ...prev,
                inputs: prev?.inputs.map((input, index) => {
                    if (index === page) {
                        return formInputsPage
                    }
                    return input
                })
            }
        })
    }

    const deleteField = (f: IFormBuildInput) => {
        const formInputsPage = form?.inputs[page]
        const finalPage = formInputsPage.filter(input => input !== f)
        setForm(prev => {
            return {
                ...prev,
                inputs: prev?.inputs.map((input, index) => {
                    if (index === page) {
                        return finalPage
                    }
                    return input
                })
            }
        })
        if (field.register === f.register) {
            setField({} as IFormBuildInput)
        }
    }

    const replaceField = (field: IFormBuildInput) => {
        const formInputsPage = form?.inputs[page]
        const finalPage = formInputsPage.map(input => {
            if (input.register === field.register) {
                return field
            }
            return input
        })
        setForm(prev => {
            return {
                ...prev,
                inputs: prev?.inputs.map((input, index) => {
                    if (index === page) {
                        return finalPage
                    }
                    return input
                })
            }
        })
        setField({} as IFormBuildInput)
    }

    const replaceInputs = (page: number, inputs: IFormBuildInput[]) => {
        setForm(prev => {
            return {
                ...prev,
                inputs: prev?.inputs.map((input, index) => {
                    if (index === page) {
                        return inputs
                    }
                    return input
                })
            }
        })
    }

    const addNewPage = () => {
        setForm(prev => {
            return {
                ...prev,
                inputs: [...prev?.inputs, []]
            }
        })
        setPage(prev => prev + 1)
    }

    const removePage = () => {
        setForm(prev => {
            return {
                ...prev,
                inputs: prev?.inputs.filter((input, index) => index !== page)
            }
        })
        setPage(prev => prev - 1)
    }

    const {
        companyAllFormSection: formSections
    } = useGETCompanyDataHooks({
        query: 'FORM_SECTION',
        defaultParams: {
            formSections: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        createCompanyData: createForm,
    } = usePOSTCompanyDataHooks({
        query: 'FORMS'
    })

    const saveLocal = useDebounce(() => {
        localStorage.setItem('createForm', JSON.stringify(form))
    }, 2000)

    const getLocal = () => {
        const local = localStorage.getItem('createForm')
        if (!local) return
        setForm(JSON.parse(local))
    }

    useEffect(() => {
        saveLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form])

    useEffect(() => {
        getLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='grid grid-cols-[250px,1fr,250px] gap-4'>
            <RenderAddFields
                form={form}
                addField={addField}
                addNewPage={addNewPage}
            />
            <RenderForm
                form={form}
                setForm={setForm}
                page={page}
                setPage={setPage}
                setField={setField}
                deleteField={deleteField}
                replaceInputs={replaceInputs}
                removePage={removePage}
                formSections={formSections?.data || []}
                createForm={createForm}
            />
            {field?.register && <UpdateField field={field} replaceField={replaceField} />}
        </div>
    )
}