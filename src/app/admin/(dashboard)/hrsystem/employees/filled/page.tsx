'use client'
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import Wrap from "@/components/common/wrap"
import { FilledUserTable } from "./_components/filledUserTable"
import { filledUserColumnsTable } from "./_components/filledUserColumnsTable"
import { IQueryPagination } from "@/common/types/settings.interface"

export default function Filled() {
    const {
        allUsers: filledUsers,
        setGETUserDataParams: setGetFilledUsers,
        GETUserDataParams: GETFilledUsers,
        isUserDataFetching: isFilledUsersFetching
    } = useGETUserDataHooks({
        query: "USER_COMPANY",
        keepParmas: true,
        defaultParams: {
            user: {
                all: {
                    status: 'Filled',
                    include: {
                        role: '1'
                    },
                    pagination: {
                        take: 40,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        companyAllRoles: allRoles,
    } = useGETCompanyDataHooks({
        query: 'ROLES',
        defaultParams: {
            roles: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                    orderBy: {
                        key: 'title',
                        order: 'asc'
                    }
                }
            }
        }
    })

    const rolesOptionsPopover = allRoles?.data?.map(r => {
        return {
            label: r.title,
            value: r.id
        }
    }) || []

    return (
        <div className='flex-col-container gap-8'>
            <Wrap
                isLoading={isFilledUsersFetching}
                header={{
                    title: {
                        title: 'Filed Employees',
                        icon: "Users"
                    },
                    pagination: {
                        pagination: filledUsers?.pagination,
                        onPageChange: (page: IQueryPagination) => setGetFilledUsers(prev => ({
                            user: {
                                all: {
                                    ...prev?.user?.all,
                                    pagination: page
                                }
                            }
                        })),
                        queryPagination: GETFilledUsers?.user?.all?.pagination!,
                        isFetching: isFilledUsersFetching
                    }
                }}
                actions={{
                    searchInput: {
                        onSearchChange: (e) => setGetFilledUsers(prev => ({
                            user: {
                                all: {
                                    ...prev?.user?.all,
                                    pagination: {
                                        take: 40,
                                        skip: 0
                                    },
                                    status: 'Filled',
                                    name: e
                                }
                            }
                        })),
                        placeholder: "Search by name...",
                        value: GETFilledUsers?.user?.all?.name || '',
                        custom: 'max-w-sm relative'
                    },

                    optionsPopover: {
                        isLoading: isFilledUsersFetching,
                        options: [{
                            label: 'Role',
                            placeholder: 'Role',
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...rolesOptionsPopover,
                            ],
                            value: GETFilledUsers?.user?.all?.role_id || 'all',
                            onChange: (e) => setGetFilledUsers(prev => ({
                                user: {
                                    all: {
                                        ...prev?.user?.all,
                                        role_id: e == 'all' ? undefined : e,
                                        pagination: {
                                            take: 40,
                                            skip: 0
                                        }
                                    }
                                }
                            })),
                        }]
                    },
                    className: 'flex justify-end gap-4 items-center',
                }}
            >
                <FilledUserTable data={filledUsers?.data} columns={filledUserColumnsTable} />
            </Wrap>
        </div>
    )
}