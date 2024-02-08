"use client"
import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import RosterInfo from "../../hrsystem/roster/_components/table/rosterDisplay/rosterInfo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"


//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import { IGETUserDataQuery } from "@/hooks/user/IGetUserDataHooks.interface"
import { IForm } from "@/common/types/company/form.interface"
import { IUser } from "@/common/types/user/user.interface"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface DayRosterColumnsTableProps {
    shifts: IShifts[]
    duties: IDuties[]
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    forms: IForm[]
    userParams: IGETUserDataQuery
}

export const dayRosterColumnsTable = ({
    shifts,
    duties,
    updateRoster,
    createRosterTask,
    deleteRosterTask,
    forms,
    userParams
}: DayRosterColumnsTableProps): ColumnDef<IUser>[] => {

    const date = userParams?.user?.all?.include?.roster?.gte || new Date()

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
            accessorKey: "profile_image",
            size: 40,
            header: () => <div className="text-left">Avatar</div>,
            cell: ({ row }) => {
                const name = row.getValue('name') as string || ''
                return (
                    <Avatar className='h-12 w-12'>
                        <AvatarImage src={row.getValue('profile_image')} alt={row.getValue('name')} />
                        <AvatarFallback>
                            {name?.split('')[0]}
                        </AvatarFallback>
                    </Avatar>
                )
            }
        },
        {
            accessorKey: "name",
            header: () => <div className="text-left max-w-48">Name</div>,
            size: 150
        },
        {
            accessorKey: "duty",
            header: () => <div className="text-left">Duty</div>,
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>

                }

                return (
                    <div className="text-left">
                        {roster?.duty}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "shift",
            header: () => <div className="text-left">Shift</div>,
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div className="text-left">
                        {roster?.shift}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "tasks",
            header: "Tasks",
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div>
                        <span className="text-left">{roster?.tasks?.length} tasks</span>
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "clock_in",
            header: "Clock In",
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div className="flex-container-center justify-center h-12 rounded-lg text-dark bg-green-300 dark:bg-green-800 dark:text-white">
                        {roster?.clock_in ? formatDate({
                            date: roster?.clock_in,
                            f: 'HH:mm:ss'
                        }) : '-'}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "break_in",
            header: "Break In",
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div className="flex-container-center justify-center h-12 rounded-lg text-dark bg-orange-300 dark:bg-orange-800 dark:text-white">
                        {roster?.break_in ? formatDate({
                            date: roster?.break_in,
                            f: 'HH:mm:ss'
                        }) : '-'}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "break_out",
            header: "Break Out",
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div className="flex-container-center justify-center h-12 rounded-lg text-dark bg-orange-300 dark:bg-orange-800 dark:text-white">
                        {roster?.break_out ? formatDate({
                            date: roster?.break_out,
                            f: 'HH:mm:ss'
                        }) : '-'}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "clock_out",
            header: "Clock Out",
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div className="flex-container-center justify-center h-12 rounded-lg text-dark bg-red-300 dark:bg-red-800 dark:text-white">
                        {roster?.clock_out ? formatDate({
                            date: roster?.clock_out,
                            f: 'HH:mm:ss'
                        }) : '-'}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const roster = row?.original?.roster?.find(r => new Date(r.date!).toDateString() === new Date(date).toDateString())

                if (!roster) {
                    return <div className="text-left">No roster</div>
                }

                return (
                    <div className="flex-container-center">
                        <RosterInfo
                            roster={roster}
                            createRosterTask={createRosterTask}
                            deleteRosterTask={deleteRosterTask}
                            forms={forms}
                            updateRoster={updateRoster}
                            shifts={shifts}
                            duties={duties}
                            user={row.original}
                            buttonClassName="h-8 w-8 p-2 text-xl"
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}