"use client"
import { UseMutateFunction } from "react-query"

//libs
import { convertMinutesToHoursAndMinutes, formatDate } from "@/common/libs/date-fns/dateFormat"
import { orderControllersTotal } from "@/common/libs/restaurant/orderController"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { ColumnDef } from "@tanstack/react-table"

//hooks
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface"

//interface
import { IFinishedTable } from "@/common/types/restaurant/tables.interface"
import LinkButton from "@/components/common/linkButton"
import { RedirectTo } from "@/common/types/routers/endPoints.types"

export interface FinishedTableColumnsTableProps {

}

export const finishedTablesColumnsTable = ({ }: FinishedTableColumnsTableProps): ColumnDef<IFinishedTable>[] => {
    return [
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
                    <div className='flex-container items-center gap-4'>
                        {/* {onDelete?.isUserAuthorized &&
                            <DeleteDialogButton
                                onDelete={() => onDelete.action({
                                    finishedTable: {
                                        id: row?.original?.id
                                    }
                                })}
                                isDisabled={true}
                            />
                        } */}
                        <LinkButton
                            href={RedirectTo.FINISHED_TABLE + `/${row?.original?.id}`}
                        />
                    </div>
                )
            }
        },

    ]

}