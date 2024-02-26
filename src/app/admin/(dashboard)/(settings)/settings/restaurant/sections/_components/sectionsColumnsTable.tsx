"use client"
import { ISection } from "@/common/types/restaurant/tables.interface"
import { Badge } from "@/components/ui/badge"
import { IDELETERestaurantDataBody } from "@/hooks/restaurant/IDeleteRestaurantDataHooks.interface"
import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"
import AddTable from "./addTable"
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { cn } from "@/common/libs/shadcn/utils"
import { IBookingDays } from "@/common/types/restaurant/config.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface SectionsColumnsTableProps {
    daysOpen: IBookingDays[]
    addTable: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    deleteTable: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    deleteSection: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    editSection: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const sectionsColumnsTable = ({
    addTable,
    deleteTable,
    deleteSection,
    editSection,
    daysOpen
}: SectionsColumnsTableProps): ColumnDef<ISection>[] => {
    return [

        {
            accessorKey: "title",
            header: () => <div className="text-left max-w-48">Title</div>,
            size: 60
        },
        {
            accessorKey: "priority",
            header: () => <div className="text-left">Priority</div>,
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center gap-4'>
                        <Button
                            size='iconExSm'
                            disabled={row?.original?.priority === 1}
                            onClick={async () => await editSection({
                                section: {
                                    id: row?.original?.id,
                                    priority: row?.original?.priority - 1
                                }
                            })}
                        >
                            <Icon name='Minus' />
                        </Button>
                        {row?.original?.priority}
                        <Button
                            size='iconExSm'
                            disabled={row?.original?.priority === 3}
                            onClick={async () => await editSection({
                                section: {
                                    id: row?.original?.id,
                                    priority: row?.original?.priority + 1
                                }
                            })}
                        >
                            <Icon name='Plus' />
                        </Button>
                    </div>
                )
            }
        },
        {
            accessorKey: "tables",
            header: "Tables / Seats / Status",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center flex-wrap">
                        {row?.original?.tables?.length === 0 &&
                            <i className='text-foreground/20'>No tables</i>
                        }
                        {row?.original?.tables?.sort((a, b) => a.number < b.number ? -1 : 1).map(t => {
                            return (
                                <DeleteDialogButton
                                    key={t?.id}
                                    onDelete={async () => await deleteTable({
                                        table: {
                                            id: t?.id
                                        }
                                    })}
                                    isDisabled={true}
                                >
                                    <div
                                        className='flex items-center bg-background-soft rounded-lg cursor-pointer p-2 hover:bg-red-300 dark:hover:bg-red-800'
                                    >
                                        Nº: {t?.number} / Seats: {t?.guests} / <div className={cn("h-3 w-3 rounded-full ml-2", t?.is_open ? 'bg-green-600' : 'bg-red-500')} />
                                    </div>
                                </DeleteDialogButton>
                            )
                        })}
                    </div>
                )
            },
            size: 450
        },
        {
            accessorKey: "days_open",
            header: "Days Open",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center flex-wrap">
                        {daysOpen?.sort((a, b) => {
                            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
                        }).map(day => {
                            return (
                                <Button
                                    key={day?.id}
                                    size='sm'
                                    variant={row?.original?.days_open?.find(d => d?.id === day?.id) ? 'green' : 'secondary'}
                                    onClick={async () => {
                                        if (row?.original?.days_open?.find(d => d?.id === day?.id)) {
                                            await editSection({
                                                section: {
                                                    id: row?.original?.id,
                                                    disconnect: {
                                                        days_open: {
                                                            ids: [day?.id]
                                                        }
                                                    }
                                                }
                                            })
                                            return
                                        } else {
                                            await editSection({
                                                section: {
                                                    id: row?.original?.id,
                                                    connect: {
                                                        days_open: {
                                                            ids: [day?.id]
                                                        }
                                                    }
                                                }
                                            })
                                            return
                                        }
                                    }}
                                >
                                    {day?.short_day}
                                </Button>
                            )
                        })}
                    </div>
                )
            },
            size: 450
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-left">Actions</div>,
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <AddTable
                            addTable={addTable}
                            section={row?.original}
                        />
                        <DeleteDialogButton
                            onDelete={async () => await deleteSection({
                                section: {
                                    id: row?.original?.id

                                }
                            })}
                            isDisabled={row?.original?.tables?.length > 0}
                        />
                    </div>
                )
            },
        },
    ]
}