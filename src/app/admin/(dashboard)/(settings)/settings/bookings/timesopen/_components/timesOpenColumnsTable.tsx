"use client"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { IBookingDays, ITimesOpen } from "@/common/types/restaurant/config.interface"
import { compareAscDate, parseISODate } from "@/common/libs/date-fns/dateFormat"
import { UseMutateFunction } from "react-query"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

interface TimesOpenColumnsTableProps {
    updateTimesOpen: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}


const sortByOpenTime = (array: ITimesOpen[]) => {
    array.sort((a, b) => {
        const timeA = parseISODate(`2000-01-01T${a.open}`);
        const timeB = parseISODate(`2000-01-01T${b.open}`);
        return compareAscDate(timeA, timeB);
    });

    return array;
}

export const timesOpenColumnsTable = ({
    updateTimesOpen
}: TimesOpenColumnsTableProps): ColumnDef<IBookingDays>[] => {
    return [
        {
            accessorKey: "day",
            header: () => <div className="text-left max-w-48">Day</div>,
            size: 60
        },
        {
            accessorKey: "times_open",
            header: () => <div className="text-left">Times Open</div>,
            size: 800,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center flex-wrap gap-4'>
                        {row?.original?.times_open?.length <= 0 &&
                            <i className='text-foreground/20'>No Times Open</i>
                        }
                        {sortByOpenTime(row?.original?.times_open)?.map((time) => {
                            return (
                                <DeleteDialogButton
                                    key={time?.id}
                                    onDelete={async () => await updateTimesOpen({
                                        timesOpen: {
                                            id: time?.id,
                                            disconnect: {
                                                days_ids: [row?.original?.id]
                                            }
                                        }
                                    })}
                                >
                                    <div
                                        key={time?.id}
                                        className='bg-background-soft p-1 rounded-lg cursor-pointer hover:bg-red-300 dark:hover:bg-red-800'
                                    >
                                        <small>
                                            {time?.title}
                                        </small>
                                    </div>
                                </DeleteDialogButton>
                            )
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-left">Actions</div>,
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">

                    </div>
                )
            },
        },
    ]
}