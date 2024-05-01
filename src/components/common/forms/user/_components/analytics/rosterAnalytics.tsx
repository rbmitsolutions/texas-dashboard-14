import { useState } from "react";

//libs
import { formatDate, getFistDayOfTheWeek } from "@/common/libs/date-fns/dateFormat";

//components
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";

//hooks
import { useGETCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IUser } from "@/common/types/user/user.interface";
import { RosterAnalyticsColumnsTable } from "./_components/rosterAnalyticsColumns";

interface RosterAnalyticsProps {
    user: IUser
}

export default function RosterAnalytics({ user }: RosterAnalyticsProps) {
    const {
        companyAllRoster: roster,
        setGETCompanyDataParams,
        GETCompanyDataParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'ROSTER',
        defaultParams: {
            roster: {
                all: {
                    user_id: user?.id,
                    date: {
                        gte: new Date(formatDate({
                            date: getFistDayOfTheWeek(new Date()),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                    pagination: {
                        take: 5,
                        skip: 0
                    },
                    orderBy: {
                        key: 'date',
                        order: 'desc'
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!user?.id
        }
    })

    const {
        updateCompanyData: updateRoster
    } = usePUTCompanyDataHooks({
        query: 'ROSTER',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'User',
                    title: 'Roster'
                },
                pagination: {
                    onPageChange: (page) => {
                        setGETCompanyDataParams(prev => ({
                            roster: {
                                all: {
                                    ...prev?.roster?.all,
                                    pagination: page,
                                    date: {
                                        gte: new Date(formatDate({
                                            date: new Date(prev?.roster?.all?.date?.gte!),
                                            f: 'yyyy-MM-dd'
                                        })),
                                        lte: new Date(
                                            formatDate({
                                                date: new Date(prev?.roster?.all?.date?.lte!),
                                                f: 'yyyy-MM-dd'
                                            })
                                        )

                                    }
                                }
                            }
                        }))
                    },
                    pagination: roster?.pagination,
                    queryPagination: GETCompanyDataParams?.roster?.all?.pagination!
                }
            }}
            actions={{
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (data) => setGETCompanyDataParams(prev => ({
                            roster: {
                                all: {
                                    ...prev?.roster?.all,
                                    user_id: user?.id,
                                    date: {
                                        gte: new Date(formatDate({
                                            date: new Date(data?.from!),
                                            f: 'yyyy-MM-dd'
                                        })),
                                        lte: new Date(
                                            formatDate({
                                                date: new Date(data?.to!),
                                                f: 'yyyy-MM-dd'
                                            })
                                        )
                                    }
                                }
                            }
                        })),
                        max: 30,
                        value: {
                            from: GETCompanyDataParams?.roster?.all?.date?.gte!,
                            to: GETCompanyDataParams?.roster?.all?.date?.lte!
                        }
                    },
                },

                className: 'flex-container'
            }}
            className="bg-background-soft p-4 rounded-lg"
        >
            <BasicTable
                columns={RosterAnalyticsColumnsTable({
                    updateRoster
                })}
                data={roster?.data || []}
            />
        </Wrap>
    )
}