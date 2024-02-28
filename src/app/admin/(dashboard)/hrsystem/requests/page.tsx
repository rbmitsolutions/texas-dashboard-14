'use client'
import { useRouter } from "next/navigation"

//components
import { requestsColumnsTable } from "./_components/requestsColumns"
import { RequestsTables } from "./_components/requestsTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interface
import { IRequestsStatus } from "@/common/types/company/requests.interface"
import { IQueryPagination } from "@/common/types/settings.interface"

export default function RequestsPage() {
    const router = useRouter()
    const {
        companyAllRequests: requests,
        setGETCompanyDataParams: setRequestsParams,
        GETCompanyDataParams: requestsParams
    } = useGETCompanyDataHooks({
        query: 'REQUESTS',
        // keepParmas: true,
        defaultParams: {
            requests: {
                all: {
                    status: IRequestsStatus.Waiting,
                    pagination: {
                        take: 30,
                        skip: 0
                    },
                    include: {
                        user: '1'
                    },
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
                    },
                }
            }
        }
    })

    const requestsTypesOptions = Object.values(IRequestsStatus).map(type => {
        return {
            label: type,
            value: type
        }
    }) || []

    return (
        <Wrap
            header={{
                title: {
                    title: 'Requests',
                    icon: 'Mails'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setRequestsParams(prev => ({
                        requests: {
                            all: {
                                ...prev.requests?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: requests?.pagination,
                    queryPagination: requestsParams?.requests?.all?.pagination!,

                },
            }}
            actions={{
                searchInput: {
                    onSearchChange: (e) => setRequestsParams(prev => ({
                        requests: {
                            all: {
                                ...prev.requests?.all,
                                user: {
                                    name: e
                                }

                            }
                        }
                    })),
                    value: requestsParams?.requests?.all?.user?.name || '',
                    placeholder: 'Search by name'
                },
                optionsPopover: {
                    options: [{
                        label: 'Status',
                        placeholder: 'Status',
                        value: requestsParams?.requests?.all?.status || '',
                        options: requestsTypesOptions,
                        onChange: (status) => setRequestsParams(prev => ({
                            requests: {
                                all: {
                                    ...prev.requests?.all,
                                    status: IRequestsStatus[status as keyof typeof IRequestsStatus]
                                }
                            }
                        }))
                    }]
                },
                className: 'grid grid-cols-[1fr,auto] gap-4 items-center w-ful'
            }}
        >
            <RequestsTables
                columns={requestsColumnsTable()}
                data={requests?.data || []}
            />
        </Wrap>
    )
}