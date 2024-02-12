"use client"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"
import { IBookings } from "@/common/types/restaurant/bookings.interface"
import InfoBadge from "@/components/common/infoBadge"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const clientBookingsColumnsTable: ColumnDef<IBookings>[] = [
    {
        accessorKey: "date",
        header: () => <div className="text-left max-w-48">Date</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {formatDate({
                        date: row?.original?.date,
                        f: 'dd/MM/yyyy'
                    })}
                </div>
            )
        }
    },
    {
        accessorKey: "time",
        header: () => <div className="text-left">Time</div>,
        size: 150
    },
    {
        accessorKey: "request",
        header: () => <div className="text-left">Request</div>,
        size: 200,
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2 text-justify'>
                    {row?.original?.request}
                </div>
            )
        }
    },
    {
        accessorKey: "amount_of_people",
        header: () => <div className="text-left">Guests</div>,
        size: 40
    },
    {
        accessorKey: "status",
        header: () => <div className="text-left">Status</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2'>
                    {<InfoBadge status={row?.original?.status} />}
                </div>
            )
        }
    },
    {
        accessorKey: "reviewd",
        header: () => <div className="text-left">Reviwed</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2'>
                    {row?.original?.review_id ? <Icon name='ThumbsUp' /> : <Icon name='ThumbsDown' />}
                </div>
            )
        }
    },
]