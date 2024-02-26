"use client"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { ISpecialDays } from "@/common/types/restaurant/config.interface";
import { Switch } from "@/components/ui/switch";
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import { UseMutateFunction } from "react-query";
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface";

interface SpecialDaysColumnsTableProps {
    deleteSpecialDay: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
}

export const specialDaysColumnsTable = ({
    deleteSpecialDay,
}: SpecialDaysColumnsTableProps): ColumnDef<ISpecialDays>[] => {
    return [
        {
            accessorKey: "day",
            header: () => <div className="text-left max-w-48">Day</div>,
            size: 120,
            cell: ({ row }) => {
                return <div className="text-left max-w-48">
                    {formatDate({
                        date: row?.original?.date,
                        f: 'dd, LLL, yy'
                    })}
                </div>
            }
        },
        {
            accessorKey: "is_disabled",
            header: () => <div className="text-left max-w-48">Available</div>,
            size: 120,
            cell: ({ row }) => {
                return <div className="text-left max-w-48">
                    <Switch
                        checked={!row?.original?.is_disabled}
                    />
                </div>
            }
        },
        {
            accessorKey: "times_open",
            header: () => <div className="text-left">Times Open</div>,
            size: 700,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center flex-wrap gap-4'>
                        {row?.original?.times_open?.length <= 0 &&
                            <i className='text-foreground/20'>No Times Open</i>
                        }
                        {row?.original?.times_open?.map(time => {
                            return (
                                <Badge
                                    key={time?.id}
                                    variant='secondary'
                                >
                                    <small>
                                        {time?.title}
                                    </small>
                                </Badge>
                            )
                        })}

                    </div>
                )
            }
        },
        {
            accessorKey: "sections",
            header: () => <div className="text-left">Sections Open</div>,
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center flex-wrap gap-4'>
                        {row?.original?.times_open?.length <= 0 &&
                            <i className='text-foreground/20'>No Times Open</i>
                        }
                        {row?.original?.sections_open?.map(s => {
                            return (
                                <Badge
                                    key={s?.id}
                                    variant='secondary'
                                >
                                    <small>
                                        {s?.title}
                                    </small>
                                </Badge>
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
                        <DeleteDialogButton
                            onDelete={async () => {
                                await deleteSpecialDay({
                                    specialDay: {
                                        id: row?.original?.id
                                    }
                                })
                            }}
                        />
                    </div>
                )
            },
        },
    ]
}