'use client'

//components
import { rolesColumnsTable } from "./_components/rolesColumns"
import CreateRoleForm from "./_components/createRoleForm"
import { RolesTables } from "./_components/rolesTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IQueryPagination } from "@/common/types/settings.interface"
import { useRouter } from "next/navigation"

export default function Roles() {
    const { push } = useRouter()
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
                toRight: <CreateRoleForm
                    createRole={createRole}
                    isLoading={isLoading}
                    departments={departments?.data || []}
                />,
                className: 'flex justify-end'
            }}
        >
            <RolesTables
                columns={rolesColumnsTable({
                    onDelete,
                    redirectTo: push,
                    onUpdate,
                    departments: departments?.data || []
                })}
                data={roles?.data || []}
            />
        </Wrap>
    )
}