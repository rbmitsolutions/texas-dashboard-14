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
import { IFormBuildInput } from "@/common/utils/formBuilder";

export default function CreateFormPage() {
    const [page, setPage] = useState<number>(0)
    const [field, setField] = useState<IFormBuildInput>({} as IFormBuildInput)
    const [inputs, setInputs] = useState<IFormBuildInput[][]>([[]])

    const addField = (field: IFormBuildInput) => {
        const formInputsPage = inputs[page]
        formInputsPage.push(field)
        setInputs(prev => {
            return prev?.map((input, index) => {
                if (index === page) {
                    return formInputsPage
                }
                return input
            })
        })
    }

    const deleteField = (f: IFormBuildInput) => {
        const formInputsPage = inputs[page]
        const finalPage = formInputsPage.filter(input => input !== f)
        setInputs(prev => {
            return prev?.map((input, index) => {
                if (index === page) {
                    return finalPage
                }
                return input
            })
        })
        if (field.register === f.register) {
            setField({} as IFormBuildInput)
        }
    }

    const replaceField = (field: IFormBuildInput) => {
        const formInputsPage = inputs[page]
        const finalPage = formInputsPage.map(input => {
            if (input.register === field.register) {
                return field
            }
            return input
        })
        setInputs(prev => {
            return prev?.map((input, index) => {
                if (index === page) {
                    return finalPage
                }
                return input
            })
        })
        setField({} as IFormBuildInput)
    }

    const replaceInputs = (page: number, inputs: IFormBuildInput[]) => {
        setInputs(prev => {
            return prev?.map((input, index) => {
                if (index === page) {
                    return inputs
                }
                return input
            })
        })
    }

    const addNewPage = () => {
        setInputs(prev => {
            return [...prev, []]
        })
        setPage(prev => prev + 1)
    }

    const removePage = () => {
        setInputs(prev => {
            return prev?.filter((input, index) => index !== page)
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
        localStorage.setItem('formInputs', JSON.stringify(inputs))
    }, 2000)

    const getLocal = () => {
        const local = localStorage.getItem('formInputs')
        if (!local) return
        setInputs(JSON.parse(local))
    }

    useEffect(() => {
        saveLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputs])

    useEffect(() => {
        getLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='grid grid-cols-[250px,1fr] gap-4'>
            <RenderAddFields
                inputs={inputs}
                addField={addField}
                addNewPage={addNewPage}
            />
            <RenderForm
                inputs={inputs}
                setInputs={setInputs}
                page={page}
                setPage={setPage}
                setField={setField}
                deleteField={deleteField}
                replaceInputs={replaceInputs}
                removePage={removePage}
                formSections={formSections?.data || []}
                createForm={createForm}
            />
            {field?.register && <UpdateField field={field} setField={setField} replaceField={replaceField} />}
        </div>
    )
}