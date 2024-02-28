'use client'
//components
import { formsColumnsTable } from "./_components/formsColumns"
import { FormsTables } from "./_components/formsTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { IQueryPagination } from "@/common/types/settings.interface"

export default function FormsPage() {
    const { user } = useAuthHooks()
    const {
        companyAllForms: forms,
        setGETCompanyDataParams: setFormParams,
        GETCompanyDataParams: formsParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'FORMS',
        keepParmas: true,
        defaultParams: {
            forms: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    include: {
                        section: '1'
                    }
                }
            }
        }
    })

    const {
        companyAllFormSection: formsSections
    } = useGETCompanyDataHooks({
        query: 'FORM_SECTION',
        defaultParams: {
            formSections: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        deleteCompanyData: deleteForm
    } = useDELETECompanyDataHooks({
        query: "FORMS",
        toRefetch
    })


    const sections = formsSections?.data?.map((section) => ({
        label: section.title,
        value: section.id
    })) || []

    return (
        <Wrap
            header={{
                title: {
                    title: 'Forms',
                    icon: 'FileText'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setFormParams(prev => ({
                        forms: {
                            all: {
                                ...prev?.forms?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: forms?.pagination,
                    queryPagination: formsParams?.forms?.all?.pagination!,

                },
            }}
            actions={{
                searchInput: {
                    onSearchChange: (e) => setFormParams(prev => ({
                        forms: {
                            all: {
                                ...prev.forms?.all,
                                title: e
                            }
                        }
                    })),
                    value: formsParams?.forms?.all?.title || '',
                    placeholder: 'Search by title'
                },
                optionsPopover: {
                    options: [{
                        label: 'Section',
                        placeholder: 'All',
                        value: formsParams?.forms?.all?.section_id || 'all',
                        options: [{ label: 'All', value: 'all' }, ...sections],
                        onChange: (id) => setFormParams(prev => ({
                            forms: {
                                all: {
                                    ...prev.forms?.all,
                                    section_id: id === 'all' ? undefined : id,
                                    pagination: {
                                        take: 20,
                                        skip: 0
                                    }
                                }
                            }
                        }))
                    }]
                },
                className: 'grid grid-cols-[1fr,auto] gap-4 items-center w-ful'
            }}
        >
            <FormsTables
                columns={formsColumnsTable({
                    deleteForm,
                    user
                })}
                data={forms?.data || []}
            />
        </Wrap>
    )
}