'use client'

//components
import { dutiesColumnsTable } from "./_components/dutiesColumns"
import CreateDutyForm from "./_components/createDutyForm"
import { DutiesTables } from "./_components/dutiesTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

export default function Duties() {
    const {
        companyAllDuties: duties,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'DUTIES',
        defaultParams: {
            duties: {
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
        companyAllDepartaments: departaments,
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
        createCompanyData: createDuty,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'DUTIES',
        toRefetch
    })

    const {
        deleteCompanyData: onDelete,
    } = useDELETECompanyDataHooks({
        query: 'DUTIES',
        toRefetch
    })
    
    return (
        <Wrap
            header={{
                title: {
                    icon: 'SquareStack',
                    title: 'Duties'
                }
            }}
            actions={{
                toRight: <CreateDutyForm
                    createDuty={createDuty}
                    isLoading={isLoading}
                    departaments={departaments?.data || []}
                />,
                className: 'flex justify-end'
            }}
        >
            <DutiesTables
                columns={dutiesColumnsTable({
                    onDelete
                })}
                data={duties?.data || []}
            />
        </Wrap>
    )
}