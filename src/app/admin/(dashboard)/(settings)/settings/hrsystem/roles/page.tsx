'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

//components
import { rolesColumnsTable } from "./_components/rolesColumns"
import { BasicTable } from "@/components/common/basicTable"
import CreateRoleForm from "./_components/createRoleForm"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IQueryPagination } from "@/common/types/settings.interface"
import { Button } from "@/components/ui/button"

export default function Roles() {
    const { push } = useRouter()
    const [showOnlyWorking, setShowOnlyWorking] = useState<boolean>(true)
    const {
        companyAllRoles: roles,
        setGETCompanyDataParams: setRolesParams,
        GETCompanyDataParams: rolesParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'ROLES',
        defaultParams: {
            roles: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    includes: {
                        departament: '1',
                        users: '1'
                    }
                }
            }
        }
    })

    const {
        companyAllDepartaments: departments,
    } = useGETCompanyDataHooks({
        query: 'DEPARTAMENTS',
        defaultParams: {
            departments: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        createCompanyData: createRole,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'ROLES',
        toRefetch
    })

    const {
        updateCompanyData: onUpdate,
    } = usePUTCompanyDataHooks({
        query: 'ROLES',
        toRefetch
    })

    const {
        deleteCompanyData: onDelete,
    } = useDELETECompanyDataHooks({
        query: 'ROLES',
        toRefetch
    })

    const showRoles = roles?.data?.map(role => {
        let users = role?.users
        if (showOnlyWorking) {
            users = role?.users?.filter(user => user.status === 'Working')
        }

        return {
            ...role,
            users
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
                    onPageChange: (pagination: IQueryPagination) => setRolesParams(prev => ({
                        roles: {
                            all: {
                                pagination
                            }
                        }
                    })),
                    pagination: roles?.pagination,
                    queryPagination: rolesParams?.roles?.all?.pagination!
                }
            }}
            actions={{
                toRight:
                    <div className='space-x-4'>
                        <Button
                            onClick={() => setShowOnlyWorking(!showOnlyWorking)}
                            variant={showOnlyWorking ? 'default' : 'outline'}
                        >
                            Working Only
                        </Button>
                        <CreateRoleForm
                            createRole={createRole}
                            isLoading={isLoading}
                            departments={departments?.data || []}
                        />
                    </div>,
                className: 'flex justify-end'
            }}
        >
            <BasicTable
                columns={rolesColumnsTable({
                    onDelete,
                    redirectTo: push,
                    onUpdate,
                    departments: departments?.data || [],
                    showOnlyWorking
                })}
                data={showRoles || []}
            />
        </Wrap>
    )
}