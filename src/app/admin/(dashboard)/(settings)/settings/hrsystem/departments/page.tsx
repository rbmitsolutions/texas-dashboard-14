'use client'

//components
import { departamentsColumnsTable } from "./_components/departmentsColumns"
import CreateDepartamentForm from "./_components/createDepartamentForm"
import { DepartamentsTables } from "./_components/departmentsTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

export default function Departaments() {

    const {
        companyAllDepartaments,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'DEPARTAMENTS',
        defaultParams: {
            departments: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    includes: {
                        duties: '1',
                        roles: '1'
                    }
                }
            }
        }
    })

    const {
        createCompanyData: createDepartament,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'DEPARTAMENTS',
        toRefetch
    })

    const {
        deleteCompanyData: onDelete,
    } = useDELETECompanyDataHooks({
        query: 'DEPARTAMENTS',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'SquareStack',
                    title: 'Departaments'
                }
            }}
            actions={{
                toRight: <CreateDepartamentForm
                    createDepartament={createDepartament}
                    isLoading={isLoading}
                />,
                className: 'flex justify-end'
            }}
        >
            <DepartamentsTables
                columns={departamentsColumnsTable({
                    onDelete
                })}
                data={companyAllDepartaments?.data || []}
            />
        </Wrap>
    )
}