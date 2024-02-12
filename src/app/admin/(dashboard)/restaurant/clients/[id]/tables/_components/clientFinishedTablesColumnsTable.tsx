"use client"
import { convertMinutesToHoursAndMinutes, formatDate } from "@/common/libs/date-fns/dateFormat"
import InfoBadge from "@/components/common/infoBadge"
import { ColumnDef } from "@tanstack/react-table"
import { IFinishedTable } from "@/common/types/restaurant/tables.interface"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const clientFinishedtablesColumnsTable: ColumnDef<IFinishedTable>[] = [
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
        accessorKey: "guests",
        header: () => <div className="text-left">Guests</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {row?.original?.guests}
                </div>
            )
        }
    },
    {
        accessorKey: "start_time",
        header: () => <div className="text-left">Arrived</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {formatDate({
                        date: row?.original?.start_time,
                        f: 'HH:mm:ss'
                    })}
                </div>
            )
        }
    },
    {
        accessorKey: "end_time",
        header: () => <div className="text-left">Left</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {formatDate({
                        date: row?.original?.end_time,
                        f: 'HH:mm:ss'
                    })}
                </div>
            )
        }
    },
    {
        accessorKey: "average_minutes",
        header: () => <div className="text-left">Average</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {convertMinutesToHoursAndMinutes(row?.original?.average_minutes)}
                </div>
            )
        }
    },
    {
        accessorKey: "orders",
        header: () => <div className="text-left">Orders</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {row?.original?.orders_controller?.length} Orders
                </div>
            )
        }
    },

]