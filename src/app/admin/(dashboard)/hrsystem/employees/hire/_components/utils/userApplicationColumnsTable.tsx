"use client"
import { ColumnDef } from "@tanstack/react-table"
import Icon from "@/common/libs/lucida-icon"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import FileDownloadButton from "@/components/common/fileDownloadButton"
import UserDisplay from "@/components/common/userDisplay"
import LinkButton from "@/components/common/linkButton"
import { Button } from "@/components/ui/button"

//interface
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { IAvailableDays, IJobApplicationValues, IUser } from "@/common/types/user/user.interface"

interface UserApplicationColumnsTableProps {
    selectUser: (user: IUser) => void
}


export const userApplicationColumnsTable = ({
    selectUser
}: UserApplicationColumnsTableProps): ColumnDef<IUser>[] => {
    return ([
        {
            accessorKey: "date",
            size: 100,
            header: () => <div className="text-left">Applied</div>,
            cell: ({ row }) => {
                return (
                    <div>
                        {formatDate({
                            date: row?.original?.created_at,
                            f: 'dd LLL, yy'
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: "name",
            size: 140,
            header: () => <div className="text-left">Avatar</div>,
            cell: ({ row }) => {
                return (
                    <UserDisplay
                        user={{
                            name: row?.original?.name || '',
                            profile_image: row?.original?.profile_image as string
                        }}
                        displayClass="h-8 w-8"
                    />
                )
            }
        },
        {
            accessorKey: "email",
            header: () => <div className="text-left">Email</div>,
            size: 200
        },
        {
            accessorKey: "Available",
            header: () => <div className="text-left">Available</div>,
            cell: ({ row }) => {
                const available: IAvailableDays[] = JSON.parse(row?.original?.available_days as any)
                return (
                    <div className="flex-container-center gap-2">
                        {available?.map(day => {
                            return (
                                <Button
                                    key={day?.weekDay}
                                    className="flex-container-center w-10"
                                    size='sm'
                                    variant={day?.available ? 'green' : 'destructive'}
                                >
                                    {day?.weekDay}
                                </Button>
                            )
                        })}
                    </div>
                )
            },
            size: 200
        },
        {
            accessorKey: "work_permit",
            header: () => <div className="text-left max-w-48">Work Permit</div>,
            size: 100,
            cell: ({ row }) => {
                const values: IJobApplicationValues = JSON.parse(row?.original?.job_application?.values as any || '{}')
                return (
                    <div className="flex-container-center">
                        {values?.work_permit}
                    </div>
                )
            },
        },
        {
            accessorKey: "position",
            header: () => <div className="text-left max-w-48">Position</div>,
            size: 100,
            cell: ({ row }) => {
                const values: IJobApplicationValues = JSON.parse(row?.original?.job_application?.values as any || '{}')
                return (
                    <div className="flex-container-center">
                        {values?.position}
                    </div>
                )
            },
        },
        {
            accessorKey: "experience",
            header: () => <div className="text-left max-w-48">Expirience</div>,
            size: 100,
            cell: ({ row }) => {
                const values: IJobApplicationValues = JSON.parse(row?.original?.job_application?.values as any || '{}')
                return (
                    <div className="flex-container-center">
                        {values?.experience}
                    </div>
                )
            },
        },
        {
            accessorKey: "notice_period",
            header: () => <div className="text-left max-w-48">Notice Period</div>,
            size: 100,
            cell: ({ row }) => {
                const values: IJobApplicationValues = JSON.parse(row?.original?.job_application?.values as any || '{}')
                return (
                    <div className="flex-container-center">
                        {values?.notice_period}
                    </div>
                )
            },
        },

        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <Button
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => selectUser(row.original)}
                            variant='green'
                        >
                            <Icon name='UserPlus' />
                        </Button>
                        <FileDownloadButton
                            file_id={row?.original?.job_application?.cv_id}
                        />
                        <LinkButton
                            href={`${RedirectTo.USER_PROFILE}/${row?.original?.id}`}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ])
}
