"use client"

import { ColumnDef } from "@tanstack/react-table"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//interface
import { IBookings } from "@/common/types/restaurant/bookings.interface"
import InfoBadge from "@/components/common/infoBadge"
import LinkButton from "@/components/common/linkButton"
import { RedirectTo } from "@/common/types/routers/endPoints.types"

interface BookingsColumnsTableProps {
}

export const BookingsColumnsTable = ({ }: BookingsColumnsTableProps): ColumnDef<IBookings>[] => {
    return [
        {
            id: "date",
            accessorKey: "Date",
            size: 140,
            cell: ({ row }) => {
                return formatDate({
                    date: row?.original?.updated_at,
                    f: 'dd/MM/yyyy HH:mm',
                    iso: false
                })
            }
        },
        {
            id: "client",
            accessorKey: "Client",
            size: 120,
            cell: ({ row }) => {
                return row?.original?.client?.name || ''
            }
        },
        {
            id: "time",
            accessorKey: "Time",
            size: 140,
            cell: ({ row }) => {
                return row?.original?.time
            }
        },
        {
            id: "status",
            accessorKey: "Status",
            size: 80,
            cell: ({ row }) => {
                return <InfoBadge status={row?.original?.status} />
            }
        },
        {
            id: "weekDay",
            accessorKey: "Week Day",
            size: 80,
            cell: ({ row }) => {
                return row?.original?.weekDay
            }
        },
        {
            id: "amount_of_people",
            accessorKey: "Guets",
            size: 40,
            cell: ({ row }) => {
                return row?.original?.amount_of_people
            }
        },
        {
            id: "request",
            accessorKey: "Request",
            size: 400,
            cell: ({ row }) => {
                return row?.original?.request || ''
            }
        },
        {
            id: "actions",
            accessorKey: "Actions",
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex-container items-center gap-2'>
                        <LinkButton
                            href={`${RedirectTo.CLIENT_PROFILE}/${row?.original?.client?.id}/bookings`}
                        />
                    </div>
                )
            }
        },
    ]
}