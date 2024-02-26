'use client'
import Wrap from "@/components/common/wrap"
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"
import { DayRosterTable } from "./_components/dayRosterTable"
import { dayRosterColumnsTable } from "./_components/dayRosterColumnsTable"

export default function DayrosterPage() {
    const {
        allUsers,
        isUserDataFetching: isUserDataLoading,
        setGETUserDataParams,
        GETUserDataParams,
        refetchUserData: toRefetch
    } = useGETUserDataHooks({
        query: 'USER_COMPANY',
        defaultParams: {
            user: {
                all: {
                    status: 'Working',
                    include: {
                        roster: {
                            available: '1',
                            gte: new Date(),
                            lte: new Date()
                        },
                        role: '1'
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
            isLoading={isDepartamentsLoading || isFormsLoading || isUserDataLoading || isShiftsLoading || isDutiesLoading}
        >
            {allDepartaments?.data?.map(d => {
                const users = allUsers?.data?.filter(u => u?.role?.departament_id === d.id && u?.roster?.length! > 0)
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
                            userParams: GETUserDataParams
                        })}
                        data={users}
                        setUsers={setGETUserDataParams}
                        userParams={GETUserDataParams}
                    />
                )
            })}
        </Wrap>
    )
}