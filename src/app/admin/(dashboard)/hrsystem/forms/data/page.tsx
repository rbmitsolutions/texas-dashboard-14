'use client'
import { useRouter } from "next/navigation"
import Link from "next/link"

//libs
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/common/libs/date-fns/dateFormat"

//components
import { FormDataTable } from "./_components/formDataTable"
import { Button } from "@/components/ui/button"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IFormData } from "@/common/types/company/form.interface"

export default function Data() {
    const router = useRouter()
    const {
        companyAllFormData: formsData,
        GETCompanyDataParams: GETFormDataParams,
        setGETCompanyDataParams: setGETFormDataParams,
        isCompanyDataFetching: isFormDataFetching,
        companyDataError: formsDataError
    } = useGETCompanyDataHooks({
        query: 'FORM_DATA',
        keepParmas: true,
        defaultParams: {
            formData: {
                all: {
                    created_at: {
                        gte: getFirstDayOfMonth(new Date()),
                        lte: getLastDayOfMonth(new Date())
                    },
                    orderBy: {
                        key: 'created_at',
                        order: 'asc'
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })


    const {
        companyAllFormData: forms,
        isCompanyDataLoading: isFormsLoading,
    } = useGETCompanyDataHooks({
        query: 'FORMS',
        defaultParams: {
            forms: {
                all: {
                    orderBy: {
                        key: 'title',
                        order: 'asc'
                    },
                    pagination: {
                        take: 50,
                        skip: 0
                    }
                }
            }
        }
    })

    const byFormOptions = forms?.data?.map(form => {
        return {
            label: form?.title,
            value: form?.title
        }
    }) || []

    return (
        <Wrap
            header={{
                title: {
                    title: 'Forms Data',
                    icon: 'FileText'
                },
                pagination: {
                    onPageChange: (pagination) => setGETFormDataParams(prev => {
                        return {
                            formData: {
                                all: {
                                    ...prev?.formData?.all,
                                    pagination
                                }
                            }
                        }
                    }),
                    pagination: formsData?.pagination,
                    queryPagination: GETFormDataParams?.formData?.all?.pagination!,
                    isFetching: isFormDataFetching
                },
            }}
            actions={{
                toLeft: (
                    <>
                        <Button
                            onClick={() => router.push('/admin/hrsystem/reports/create')}
                            leftIcon='AlertTriangle'>
                            Create Report
                        </Button>
                        <Link href='/admin/hrsystem/reports/all' className='ml-6'>Reports</Link>
                    </>
                ),
                optionsPopover: {
                    isLoading: isFormsLoading,
                    options: [
                        {
                            label: 'Sort by',
                            value: `${GETFormDataParams?.formData?.all?.orderBy?.key}/${GETFormDataParams?.formData?.all?.orderBy?.order}` || '',
                            onChange: (e: string) => setGETFormDataParams(prev => ({
                                formData: {
                                    all: {
                                        ...prev?.formData?.all,
                                        orderBy: {
                                            key: e?.split('/')[0] as keyof IFormData,
                                            order: e?.split('/')[1] as 'asc' | 'desc'
                                        },
                                    }
                                }
                            })),
                            placeholder: 'Sort by',
                            options: [
                                {
                                    label: 'By A-Z',
                                    value: 'by/asc'
                                },
                                {
                                    label: 'By Z-A',
                                    value: 'by/desc'
                                },
                                {
                                    label: 'Title A-Z',
                                    value: 'title/asc'
                                },
                                {
                                    label: 'Title Z-A',
                                    value: 'title/desc'
                                },
                                {
                                    label: 'Date A-Z',
                                    value: 'created_at/asc'
                                },
                                {
                                    label: 'Date Z-A',
                                    value: 'created_at/desc'
                                },
                            ]
                        },
                        {
                            label: 'To Show',
                            value: String(GETFormDataParams?.formData?.all?.pagination?.take) || '10',
                            onChange: (e: string) => setGETFormDataParams(prev => ({
                                formData: {
                                    all: {
                                        ...prev?.formData?.all,
                                        pagination: {
                                            take: Number(e),
                                            skip: prev?.formData?.all?.pagination?.skip || 0
                                        }
                                    }
                                }
                            })),
                            placeholder: 'Show',
                            options: [
                                {
                                    label: '20',
                                    value: '20'
                                },
                                {
                                    label: '40',
                                    value: '40',
                                },
                                {
                                    label: '80',
                                    value: '80',
                                },
                            ]
                        },

                        {
                            label: 'By Form',
                            value: GETFormDataParams?.formData?.all?.title || '',
                            onChange: (e: string) => setGETFormDataParams(prev => ({
                                formData: {
                                    all: {
                                        ...prev?.formData?.all,
                                        title: e === 'all' ? undefined : e,
                                        pagination: {
                                            take: 20,
                                            skip: 0
                                        }
                                    }
                                }
                            })),
                            placeholder: 'By Form',
                            options: [{
                                label: 'All',
                                value: 'all'
                            }, ...byFormOptions]
                        },
                    ]
                },
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (date) => setGETFormDataParams(prev => ({
                            formData: {
                                all: {
                                    ...prev?.formData?.all,
                                    created_at: {
                                        gte: new Date(date?.from || prev?.formData?.all?.created_at?.gte!),
                                        lte: new Date(date?.to || prev?.formData?.all?.created_at?.lte!)
                                    }
                                }
                            }
                        })),
                        max: 120
                    },
                },
                searchInput: {
                    onSearchChange: e => setGETFormDataParams(prev => {
                        return {
                            formData: {
                                all: {
                                    ...prev?.formData?.all,
                                    by: e
                                }
                            }
                        }
                    }),
                    value: GETFormDataParams?.formData?.all?.by || '',
                    placeholder: 'Search by Created By...'
                },
                className: 'grid grid-cols-1 justify-end items-center gap-4 md:grid-cols-2 lg:grid-cols-[1fr,300px,200px,40px]'
            }}
            isLoading={isFormDataFetching}
            error={formsDataError}
        >
            <FormDataTable data={formsData?.data} isFetching={isFormDataFetching} />
        </Wrap >
    )
}