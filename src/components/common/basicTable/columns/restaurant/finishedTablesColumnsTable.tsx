"use client"
import { convertMinutesToHoursAndMinutes, formatDate } from "@/common/libs/date-fns/dateFormat"
import { ColumnDef } from "@tanstack/react-table"
import { IFinishedTable } from "@/common/types/restaurant/tables.interface"
import { orderControllersTotal } from "@/common/libs/restaurant/orderController"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const finishedTablesColumnsTable: ColumnDef<IFinishedTable>[] = [
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
        accessorKey: "client",
        header: () => <div className="text-left">Client</div>,
        size: 200,
        cell: ({ row }) => {
            return (
                <div className='capitalize'>
                    {row?.original?.client?.toLowerCase()}
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
                        f: 'HH:mm:ss',
                        iso: false
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
                        f: 'HH:mm:ss',
                        iso: false
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
    {
        accessorKey: "total",
        header: () => <div className="text-left">Total</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {convertCentsToEuro(orderControllersTotal(row?.original?.orders_controller) || 0)}
                </div>
            )
        }
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-left">Action</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {/* <DeleteDialogButton
                        onDelete={() => console.log('delete')}
                        isDisabled={false}
                    />  */}
                </div>
            )
        }
    },

]