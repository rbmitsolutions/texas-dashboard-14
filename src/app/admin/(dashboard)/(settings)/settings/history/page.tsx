'use client'

//components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { historyColumnsTable } from "./_components/historyColumns"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IQueryPagination } from "@/common/types/settings.interface"
import { HistoryType } from "@/common/types/auth/auth.interface"

export default function Roles() {
    const {
        companayAllHistory: history,
        setGETCompanyDataParams: setHistoryParams,
        GETCompanyDataParams: historyParams
    } = useGETCompanyDataHooks({
        query: 'HISTORY',
        defaultParams: {
            history: {
                all: {
                    pagination: {
                        take: 50,
                        skip: 0
                    },
                }
            }
        }
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'History',
                    title: 'History'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setHistoryParams(prev => ({
                        history: {
                            all: {
                                ...prev?.history?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: history?.pagination,
                    queryPagination: historyParams?.history?.all?.pagination!
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (search: string) => setHistoryParams(prev => ({
                        history: {
                            all: {
                                ...prev?.history?.all,
                                by: search,
                                pagination: {
                                    take: 50,
                                    skip: 0
                                }
                            }
                        }
                    })),
                    value: historyParams?.history?.all?.by || '',
                    cleanSearch: () => setHistoryParams(prev => ({
                        history: {
                            all: {
                                ...prev?.history?.all,
                                by: '',
                                pagination: {
                                    take: 50,
                                    skip: 0
                                }
                            }
                        }
                    }))
                },
                toRight: (
                    <Select
                        onValueChange={(value) => setHistoryParams(prev => ({
                            history: {
                                all: {
                                    ...prev?.history?.all,
                                    type: value === 'All' ? undefined : value as HistoryType,
                                    pagination: {
                                        take: 50,
                                        skip: 0
                                    }
                                }
                            }
                        }))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Type</SelectLabel>
                                <SelectItem value="All">All</SelectItem>
                                {Object.values(HistoryType).map((type, index) => {
                                    return (
                                        <SelectItem key={index} value={type}>{type}</SelectItem>
                                    )
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )
            }}
        >
            <BasicTable
                columns={historyColumnsTable()}
                data={history?.data || []}
            />
        </Wrap>
    )
}