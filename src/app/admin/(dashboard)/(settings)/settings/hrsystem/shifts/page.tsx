'use client'

//components
import { shiftsColumnsTable } from "./_components/shiftColumns"
import CreateShiftForm from "./_components/createShiftForm"
import { ShiftsTables } from "./_components/shiftTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { IQueryPagination } from "@/common/types/settings.interface"

export default function Shifts() {
    const {
        companyAllShifts: shifts,
        setGETCompanyDataParams: setShiftsParams,
        GETCompanyDataParams: shiftsParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'SHIFTS',
        defaultParams: {
            shifts: {
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
        createCompanyData: createShift,
        isCreateCompanyDataLoading: isLoading
    } = usePOSTCompanyDataHooks({
        query: 'SHIFTS',
        toRefetch
    })

    const {
        deleteCompanyData: onDelete,
    } = useDELETECompanyDataHooks({
        query: 'SHIFTS',
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
                    onPageChange: (pagination: IQueryPagination) => setShiftsParams(prev => ({
                        shifts: {
                            all:{
                                pagination
                            }
                        }
                    })),
                    pagination: shifts?.pagination,
                    queryPagination: shiftsParams?.shifts?.all?.pagination!
                }
            }}
            actions={{
                toRight: <CreateShiftForm
                    createShift={createShift}
                    isLoading={isLoading}
                />,
                className: 'flex justify-end'
            }}
        >
            <ShiftsTables
                columns={shiftsColumnsTable({
                    onDelete
                })}
                data={shifts?.data || []}
            />
        </Wrap>
    )
}