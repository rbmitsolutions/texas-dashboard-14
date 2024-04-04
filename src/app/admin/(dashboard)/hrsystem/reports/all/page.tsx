'use client'
import { useRouter } from "next/navigation"

//components
import { columnsReports } from "./_components/columnsReport"
import { Button } from "@/components/ui/button"
import Wrap from "@/components/common/wrap"

//libs
import { getFirstDayOfMonth, getFirstTimeOfTheDay, getLastDayOfMonth, getLastTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { IQueryPagination } from "@/common/types/settings.interface"
import { BasicTable } from "@/components/common/basicTable"

export default function Reports() {
    const { user } = useAuthHooks()
    const router = useRouter()
    const {
        companyAllHaccpReports: haccpReports,
        companyDataError: haccpReportsError,
        GETCompanyDataParams: GETHaccpReports,
        setGETCompanyDataParams: setGETHaccpReports,
        isCompanyDataLoading: isHaccpReportsLoading,
        refetchCompanyData: refetchHaccpReports
    } = useGETCompanyDataHooks({
        query: 'HACCP_REPORTS',
        keepParmas: true,
        defaultParams: {
            haccpReports: {
                all: {
                    date: {
                        gte: getFirstDayOfMonth(new Date()),
                        lte: getLastDayOfMonth(new Date()),
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })

    const { deleteCompanyData: deleteHaccpReport, isDeleteCompanyDataLoading: isDeleteLoading } = useDELETECompanyDataHooks({
        query: 'HACCP_REPORTS',
        toRefetch: refetchHaccpReports,
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'AlertTriangle',
                    title: 'Haccp Reports'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setGETHaccpReports(prev => ({
                        haccpReports: {
                            all: {
                                ...prev.haccpReports?.all,
                                pagination
                            } as any
                        }
                    })),
                    pagination: haccpReports?.pagination,
                    queryPagination: GETHaccpReports?.haccpReports?.all?.pagination!,
                    isFetching: isHaccpReportsLoading,
                }
            }}
            actions={{
                toLeft: (
                    <>
                        <Button
                            onClick={() => router.push('/admin/hrsystem/reports/create')}
                            leftIcon='AlertTriangle'>
                            Create Report
                        </Button>
                    </>
                ),
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (data) => {
                            setGETHaccpReports(prev => ({
                                haccpReports: {
                                    all: {
                                        ...prev?.haccpReports?.all,
                                        date: {
                                            gte: getFirstTimeOfTheDay(new Date(data?.from!)),
                                            lte: getLastTimeOfTheDay(new Date(data?.to!))
                                        }
                                    }
                                }
                            }))
                        },
                        toDate: new Date(),
                        max: 120
                    },
                },
                searchInput: {
                    onSearchChange: e => setGETHaccpReports(prev => {
                        return {
                            haccpReports: {
                                all: {
                                    ...prev?.haccpReports?.all,
                                    created_by: e,
                                }
                            } as any
                        }
                    }),
                    value: GETHaccpReports?.haccpReports?.all?.created_by || '',
                    placeholder: 'Search by Created By...'
                },
                className: 'grid grid-cols-1 justify-end items-center gap-4 md:grid-cols-2 lg:grid-cols-[1fr,300px,250px]'
            }}
            isLoading={isHaccpReportsLoading}
            error={haccpReportsError}
        >
            <BasicTable columns={columnsReports({
                user: user,
                deleteHaccpReport,
                isDeleteLoading
            })} data={haccpReports?.data} />
        </Wrap>
    )
}