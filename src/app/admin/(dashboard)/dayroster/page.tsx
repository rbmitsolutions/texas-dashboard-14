'use client'

import { getFirstTimeOfTheDay, getLastTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"
//components
import { dayRosterColumnsTable } from "./_components/dayRosterColumnsTable"
import { DayRosterTable } from "./_components/dayRosterTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

export default function DayrosterPage() {

    const {
        companyAllRoster: roster,
        isCompanyDataFetching: isRosterLoading,
        companyDataError: error,
        setGETCompanyDataParams: setRosterParams,
        GETCompanyDataParams: GetRosterParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'ROSTER',
        defaultParams: {
            roster: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: getLastTimeOfTheDay(new Date())
                    },
                    includes:{
                        user: '1',
                        task: '1'
                    }
                }
            }
        }
    })

    const {
        companyAllForms: allForms,
        isCompanyDataLoading: isFormsLoading
    } = useGETCompanyDataHooks({
        query: 'FORMS',
        defaultParams: {
            forms: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        companyAllDepartaments: allDepartaments,
        isCompanyDataLoading: isDepartamentsLoading
    } = useGETCompanyDataHooks({
        query: 'DEPARTAMENTS',
        defaultParams: {
            departments: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                    includes: {
                        roles: '1'

                    }
                }
            }
        }
    })

    const {
        companyAllDuties: allDuties,
        isCompanyDataLoading: isDutiesLoading
    } = useGETCompanyDataHooks({
        query: 'DUTIES',
        defaultParams: {
            duties: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        companyAllShifts: allShifts,
        isCompanyDataLoading: isShiftsLoading
    } = useGETCompanyDataHooks({
        query: 'SHIFTS',
        defaultParams: {
            shifts: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        updateCompanyData: updateRoster
    } = usePUTCompanyDataHooks({
        query: 'ROSTER',
        toRefetch
    })

    const {
        createCompanyData: createRosterTask
    } = usePOSTCompanyDataHooks({
        query: 'ROSTER_TASKS',
        toRefetch
    })

    const {
        deleteCompanyData: deleteRosterTask
    } = useDELETECompanyDataHooks({
        query: 'ROSTER_TASKS',
        toRefetch
    })

    return (
        <Wrap
            isLoading={isDepartamentsLoading || isFormsLoading || isRosterLoading || isShiftsLoading || isDutiesLoading}
        >
            {allDepartaments?.data?.map(d => {
                const rosters = roster?.data?.filter(r => r?.user?.role?.departament_id === d.id)
                return (
                    <DayRosterTable
                        key={d.id}
                        departament={d}
                        columns={dayRosterColumnsTable({
                            duties: allDuties?.data,
                            shifts: allShifts?.data,
                            updateRoster,
                            createRosterTask,
                            deleteRosterTask,
                            forms: allForms?.data,
                            // userParams: GETUserDataParams
                        })}
                        data={rosters || []}
                        setRosterParams={setRosterParams}
                        GetRosterParams={GetRosterParams}
                    />
                )
            })} 
        </Wrap>
    )
}