'use client'

//components
import Wrap from "@/components/common/wrap"
import { RosterTable } from "./table"
import RosterHeader from "./header"

//libs
import { getMondayOfTheWeek, getSundayOfTheWeek } from "@/common/libs/date-fns/dateFormat"

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface"
import { IDepartaments } from "@/common/types/company/departaments.interface"
import { IForm } from "@/common/types/company/form.interface"

interface RosterContainerProps {
    departaments: IDepartaments[],
    duties: IDuties[],
    shifts: IShifts[],
    forms: IForm[]
}

export default function RosterContainer({
    duties,
    departaments,
    shifts,
    forms
}: RosterContainerProps): JSX.Element {
    const {
        companyRosterPage: users,
        isCompanyDataFetching: isLoading,
        companyDataError: error,
        setGETCompanyDataParams,
        GETCompanyDataParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'ROSTER',
        defaultParams: {
            roster: {
                rosterPage: {
                    date: {
                        gte: getMondayOfTheWeek(new Date()),
                        lte: getSundayOfTheWeek(new Date())
                    },
                    status: 'Working'
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
        createCompanyData: createRoster,
    } = usePOSTCompanyDataHooks({
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

    const {
        deleteCompanyData: deleteRoster
    } = useDELETECompanyDataHooks({
        query: 'ROSTER',
        toRefetch
    })

    return (
        <div>
            <RosterHeader
                payments_data={users?.payments_data || {}}
                isLoading={isLoading}
                error={error}
                setUsers={setGETCompanyDataParams}
                usersParams={GETCompanyDataParams}
                users={users?.users}
                updateRoster={updateRoster}
            />
            {departaments?.map(d => {
                return (
                    <Wrap
                        key={d.id}
                        header={{
                            title: {
                                icon: 'SquareStack',
                                title: d?.title
                            }
                        }}
                        actions={{
                            className: 'flex justify-start',
                            dateChange: {
                                datePickerWithRange: {
                                    onConfirm: (data) => setGETCompanyDataParams(prev => ({
                                        roster: {
                                            rosterPage: {
                                                ...prev?.roster?.rosterPage,
                                                date: {
                                                    gte: new Date(data?.from!),
                                                    lte: new Date(data?.to!)
                                                }
                                            }
                                        }
                                    })),
                                    max: 7,
                                    value: {
                                        from: GETCompanyDataParams?.roster?.rosterPage?.date?.gte!,
                                        to: GETCompanyDataParams?.roster?.rosterPage?.date?.lte!
                                    }
                                },
                            }
                        }}
                        className="mt-4 bg-background-soft p-4 rounded-xl overflow-auto"
                    >
                        <RosterTable
                            users={users?.users.filter(u => u?.role?.departament_id === d.id) || []}
                            duties={duties}
                            shifts={shifts}
                            forms={forms}
                            params={GETCompanyDataParams}
                            createRoster={createRoster}
                            deleteRoster={deleteRoster}
                            updateRoster={updateRoster}
                            createRosterTask={createRosterTask}
                            deleteRosterTask={deleteRosterTask}
                        />
                    </Wrap>
                )
            })}
        </div>
    )
}