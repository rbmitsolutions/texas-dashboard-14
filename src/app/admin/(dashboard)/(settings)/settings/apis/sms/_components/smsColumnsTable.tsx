"use client"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { ISpecialDays } from "@/common/types/restaurant/config.interface";
import { UseMutateFunction } from "react-query";
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";
import { IGETSmsMessage, IGETSmsResponse } from "@/hooks/company/IGetCompanyDataHooks.interface";
import Icon from "@/common/libs/lucida-icon";

interface SmsColumnsTableProps {
}

export const smsColumnsTable = ({
}: SmsColumnsTableProps): ColumnDef<IGETSmsMessage>[] => {
    return [
        {
            accessorKey: "date",
            header: () => <div className="text-left max-w-48">Date</div>,
            size: 120,
            cell: ({ row }) => {
                return <div>
                    {formatDate({
                        date: new Date(row?.original?.created_at),
                        f: 'dd/MM/yyyy HH:mm',
                        iso: false
                    })}
                </div>
            }
        },
        {
            accessorKey: "to",
            header: () => <div className="text-left max-w-48">To</div>,
            size: 120,
            cell: ({ row }) => {
                return <div>
                    {row?.original?.to}
                </div>
            }
        },
        {
            accessorKey: "cost",
            header: () => <div className="text-left max-w-48">Cost</div>,
            size: 80,
            cell: ({ row }) => {
                return <div className='flex gap-1 items-center'>
                    {row?.original?.cost} <Icon name="Euro" />
                </div>
            }
        },
        {
            accessorKey: "status",
            header: () => <div className="text-left max-w-48">Status</div>,
            size: 80,
            cell: ({ row }) => {
                return <div className='flex gap-1 items-center'>
                    {row?.original?.status}
                </div>
            }
        },
        {
            accessorKey: "message",
            header: () => <div className="text-left max-w-48">Message</div>,
            size: 300,
            cell: ({ row }) => {
                return <div>
                    {row?.original?.message}
                </div>
            }
        }
    ]
}