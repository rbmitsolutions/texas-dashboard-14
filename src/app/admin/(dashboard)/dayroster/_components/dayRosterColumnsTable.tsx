"use client"
import { ColumnDef, Row } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"
import { cn } from "@/common/libs/shadcn/utils"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import RosterInfo from "../../hrsystem/roster/_components/table/rosterDisplay/rosterInfo"
import UserDisplay from "@/components/common/userDisplay"
import { Checkbox } from "@/components/ui/checkbox"


//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import { IForm } from "@/common/types/company/form.interface"
import { IRoster } from "@/common/types/company/roster.interface"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface DayRosterColumnsTableProps {
    shifts: IShifts[]
    duties: IDuties[]
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    forms: IForm[]
    // userParams: IGETUserDataQuery
}

export const dayRosterColumnsTable = ({
    shifts,
    duties,
    updateRoster,
    createRosterTask,
    deleteRosterTask,
    forms,
    // userParams
}: DayRosterColumnsTableProps): ColumnDef<IRoster>[] => {

    const displayShift = (row: Row<IRoster>, t: 'clock_in' | 'break_in' | 'break_out' | 'clock_out') => {
        const roster = row?.original

        if (!roster) {
            return <div className="text-left">No roster</div>
        }

        if (roster?.shift === 'Day Off') {
            return <div className="text-left text-foreground/40"><i>Day Off</i></div>
        }

        if (roster?.shift === 'Holiday') {
            return <div className="text-left text-foreground/40"><i>Holiday</i></div>
        }

        if (roster?.shift === 'Sick Day') {
            return <div className="text-left text-foreground/40"><i>Sick Day</i></div>
        }

        const time = roster[t] ? new Date(String(roster[t])) : undefined

        const bg = () => {
            switch (t) {
                case 'clock_in':
                    return 'bg-green-300 dark:bg-green-800 dark:text-white'
                case 'break_in':
                    return 'bg-orange-300 dark:bg-orange-800 dark:text-white'
                case 'break_out':
                    return 'bg-orange-300 dark:bg-orange-800 dark:text-white'
                case 'clock_out':
                    return 'bg-red-300 dark:bg-red-800 dark:text-white'
                default:
            }
        }

        return (
            <div className={cn("flex-container-center justify-center h-12 rounded-lg text-dark", bg())}>
                {time ? formatDate({
                    date: time,
                    f: 'HH:mm:ss',
                    iso: false
                }) : '-'}
            </div>
        )

    }

    return [
        {
            id: "select",
            size: 40,
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),

        },
        {
            accessorKey: "name",
            size: 160,
            header: () => <div className="text-left">Employee</div>,
            cell: ({ row }) => {
                return (
                    <UserDisplay
                        user={{
                            name: row?.original?.user?.name || '',
                            profile_image: row?.original?.user?.profile_image as string
                        }}
                        displayClass="h-10 w-10"
                    />
                )
            }
        },
        {
            accessorKey: "duty",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Duty
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {

                return (
                    <div className="text-left">
                        {row?.original?.duty}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "shift",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Shift
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="text-left">
                        {row?.original?.shift}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "tasks",
            header: "Tasks",
            cell: ({ row }) => {
                return (
                    <div>
                        <span className="text-left">{row?.original?.tasks?.length} tasks</span>
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "clock_in",
            header: "Clock In",
            cell: ({ row }) => {
                return <>{displayShift(row, 'clock_in')}</>
            },
            size: 100
        },
        {
            accessorKey: "break_in",
            header: "Break In",
            cell: ({ row }) => {
                return <>{displayShift(row, 'break_in')}</>
            },
            size: 100
        },
        {
            accessorKey: "break_out",
            header: "Break Out",
            cell: ({ row }) => {
                return <>{displayShift(row, 'break_out')}</>
            },
            size: 100
        },
        {
            accessorKey: "clock_out",
            header: "Clock Out",
            cell: ({ row }) => {
                return <>{displayShift(row, 'clock_out')}</>
            },
            size: 100
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <RosterInfo
                            roster={row?.original}
                            createRosterTask={createRosterTask}
                            deleteRosterTask={deleteRosterTask}
                            forms={forms}
                            updateRoster={updateRoster}
                            shifts={shifts}
                            duties={duties}
                            user={row.original?.user}
                            buttonClassName="h-8 w-8 p-2 text-xl"
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}