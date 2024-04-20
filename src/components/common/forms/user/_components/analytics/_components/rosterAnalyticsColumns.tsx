"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"
import { IRoster } from "@/common/types/company/roster.interface"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import RosterInfo from "@/app/admin/(dashboard)/hrsystem/roster/_components/table/rosterDisplay/rosterInfo"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"

interface RosterAnalyticsColumnsTableProps {
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export const RosterAnalyticsColumnsTable = ({
    updateRoster
}: RosterAnalyticsColumnsTableProps): ColumnDef<IRoster>[] => {
    return [
        {
            id: "date",
            accessorKey: "Date",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div>{formatDate({
                        date: row?.original?.date,
                        f: 'dd/MM/yyyy'
                    })}</div>
                )
            }
        },
        {
            id: "duty",
            accessorKey: "Duty",
            size: 100,
            cell: ({ row }) => {
                return (
                    <div >
                        {row?.original?.day_in_lieu ? 'Day in Lieu' : row?.original?.duty}
                    </div>
                )
            }
        },
        {
            id: "shift",
            accessorKey: "Shift",
            size: 100,
            cell: ({ row }) => {
                return (
                    <div >
                        {row?.original?.day_in_lieu ? 'Day in Lieu' : row?.original?.shift}
                    </div>
                )
            }
        },
        {
            id: "clock_in",
            accessorKey: "Clock In",
            size: 100,
            cell: ({ row }) => {
                return (
                    <div >
                        {(row?.original?.clock_in && !row?.original?.day_in_lieu) && formatDate({
                            date: new Date(row?.original?.clock_in),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </div>
                )
            }
        },
        {
            id: "break_in",
            accessorKey: "Break In",
            size: 100,
            cell: ({ row }) => {
                return (
                    <div >
                        {(row?.original?.break_in && !row?.original?.day_in_lieu) && formatDate({
                            date: new Date(row?.original?.break_in),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </div>
                )
            }
        },
        {
            id: "break_out",
            accessorKey: "Break Out",
            size: 100,
            cell: ({ row }) => {
                return (
                    <div >
                        {(row?.original?.break_out && !row?.original?.day_in_lieu) && formatDate({
                            date: new Date(row?.original?.break_out),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </div>
                )
            }
        },
        {
            id: "clock_out",
            accessorKey: "Clock Out",
            size: 100,
            cell: ({ row }) => {
                return (
                    <div >
                        {(row?.original?.clock_out && !row?.original?.day_in_lieu) && formatDate({
                            date: new Date(row?.original?.clock_out),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <RosterInfo
                            roster={row?.original}
                            updateRoster={updateRoster}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}