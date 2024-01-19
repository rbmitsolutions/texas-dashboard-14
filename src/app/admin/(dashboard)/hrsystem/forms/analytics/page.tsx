'use client'
import { useRouter } from "next/navigation"

//libs
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/common/libs/date-fns/dateFormat"

//components
import { FormDataTable } from "./_components/formDataTable"
import { Button } from "@/components/ui/button"
import Wrap from "@/components/common/wrap"
import Icon from "@/common/libs/lucida-icon"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IFormData } from "@/common/types/company/form.interface"

export default function Analytics() {
    const router = useRouter()
    const {
        companyAllFormData: formsData,
        GETCompanyDataParams: GETFormDataParams,
        setGETCompanyDataParams: setGETFormDataParams,
        isCompanyDataLoading: isFormDataLoading,
        isCompanyDataFetching: isFormDataFetching,
        companyDataError: formDataError } = useGETCompanyDataHooks({
            query: 'FORM_DATA',
            keepParmas: true,
            defaultParams: {
                formData: {
                    all: {
                        type: 'form',
                        created_at: {
                            gte: getFirstDayOfMonth(new Date()),
                            lte: getLastDayOfMonth(new Date())
                        }
                    }
                }
            }
        })

    return (
        <div className=''>
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
                        <Button
                            onClick={() => router.push('/admin/hrsystem/reports/create')}
                            leftIcon={<Icon name='AlertTriangle' size={14} />}>
                            Create Report
                        </Button>
                    ),
                    optionsPopover: [
                        {
                            label: 'Sort by',
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
                    ],
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
                                        title: e
                                    }
                                }
                            }
                        }),
                        value: GETFormDataParams?.formData?.all?.title || '',
                    },
                    className: 'grid grid-cols-1 justify-end gap-4 md:grid-cols-2 lg:grid-cols-[1fr,300px,200px,40px]'
                }}
            >
                <FormDataTable data={formsData?.data} isFetching={isFormDataFetching} />
            </Wrap >
        </div >
    )
}