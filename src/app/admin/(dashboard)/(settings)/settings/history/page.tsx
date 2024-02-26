'use client'

//components
import { historyColumnsTable } from "./_components/historyColumns"
import { HistoryTables } from "./_components/historyTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IQueryPagination } from "@/common/types/settings.interface"
import { useRouter } from "next/navigation"

export default function Roles() {
    const { push } = useRouter()
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
                    icon: 'Clock2',
                    title: 'Shifts'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setHistoryParams(prev => ({
                        history: {
                            all: {
                                pagination
                            }
                        }
                    })),
                    pagination: history?.pagination,
                    queryPagination: historyParams?.roles?.all?.pagination!
                }
            }}
        >
            <HistoryTables
                columns={historyColumnsTable()}
                data={history?.data || []}
            />
        </Wrap>
    )
}