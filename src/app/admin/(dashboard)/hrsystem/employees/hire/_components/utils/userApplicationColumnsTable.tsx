"use client"
import { api } from "@/common/libs/axios/api"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"
import { IFiles } from "@/common/types/company/files.interface"
import { EndPointsTypes, RedirectTo } from "@/common/types/routers/endPoints.types"
import { IJobApplicationValues, IUser } from "@/common/types/user/user.interface"
import LinkButton from "@/components/common/linkButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import toast from "react-hot-toast"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const onDownload = async (file_id: string) => {
    try {
        const { data } = await api.get<IFiles>(EndPointsTypes.COMPANY_FILES_ENDPOINT, {
            params: {
                files: {
                    byId: {
                        id: file_id
                    }
                }
            }
        })

        const link = document.createElement('a')
        link.href = data.url
        link.download = data.title
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)


    } catch (err) {
        toast.error('File not found!')
    }
};

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
                const name = row.getValue('name') as string || ''
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
            accessorKey: "email",
            header: () => <div className="text-left">Email</div>,
            size: 200
        },
        {
            accessorKey: "health_limitations",
            header: () => <div className="text-left max-w-48">Heath Limitations</div>,
            size: 100,
            cell: ({ row }) => {
                const values: IJobApplicationValues = JSON.parse(row?.original?.job_application?.values as any || '{}')
                return (
                    <div className="flex-container-center">
                        {values?.health_limitations}
                    </div>
                )
            },
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
                            <Icon name='UserPlus'/>
                        </Button>
                        <Button
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => onDownload(row?.original?.job_application?.cv_id!)}
                            leftIcon="Download"
                        >CV</Button>
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
