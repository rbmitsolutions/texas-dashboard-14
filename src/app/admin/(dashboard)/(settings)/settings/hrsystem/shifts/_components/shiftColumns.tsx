"use client"
import { UseMutateFunction } from "react-query"

//components
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

//interfaces
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import {  IShifts } from "@/common/types/company/companyDetails.interface"
import { convertMinutesToHoursAndMinutes } from "@/common/libs/date-fns/dateFormat"

interface ShiftsColumnsTableProps {
    onDelete: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export const shiftsColumnsTable = ({
    onDelete
}: ShiftsColumnsTableProps): ColumnDef<IShifts>[] => {
    return [
        {
            id: "title",
            accessorKey: "Title",
            size: 80,
            cell: ({ row }) => {
                return (
                    <h2 className='capitalize'>{row?.original?.title}</h2>
                )
            }
        },
        {
            id: "hours",
            accessorKey: "Hours",
            size: 80,
            cell: ({ row }) => {
                return (
                    <span className='capitalize'>{convertMinutesToHoursAndMinutes(row?.original?.hours)}</span>
                )
            }
        },
        {
            id: "break",
            accessorKey: "Break",
            size: 400,
            cell: ({ row }) => {
                return (
                    <span className='capitalize'>{row?.original?.break_minutes} min</span>
                )
            }
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <DeleteDialogButton
                            onDelete={async () => await onDelete({
                                shift: {
                                    id: row?.original?.id
                                }
                            })}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}