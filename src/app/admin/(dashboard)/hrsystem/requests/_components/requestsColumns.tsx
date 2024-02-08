"use client"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

import { IRequests } from "@/common/types/company/requests.interface"
import { ImagesPath } from "@/common/types/imgs"
import { cn } from "@/common/libs/shadcn/utils"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import InfoBadge from "@/components/common/infoBadge"
import LinkButton from "@/components/common/linkButton"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const requestsColumnsTable = (): ColumnDef<IRequests>[] => {
    return [
        {
            id: 'date',
            accessorKey: 'Date',
            size: 40,
            cell: ({ row }) => {
                return (
                    formatDate({
                        date: row?.original?.created_at,
                        f: 'dd/MM/yyyy'
                    })
                )
            }
        },
        {
            id: "image",
            accessorKey: "Profile",
            size: 40,
            cell: ({ row }) => {
                return (
                    <Image
                        alt={`menu-${row?.original?.user?.name} thumbnail`}
                        src={row?.original?.user?.profile_image || ImagesPath['NO_IMAGE']}
                        width={40}
                        height={40}
                        className={cn('rounded-md', !row?.original?.user?.profile_image && 'grayscale opacity-20')}
                    />
                )
            }
        },
        {
            id: 'name',
            accessorKey: 'Name',
            size: 180,
            cell: ({ row }) => {
                return (
                    row?.original?.user?.name
                )
            }
        },
        {
            id: 'type',
            accessorKey: 'Type',
            size: 120,
            cell: ({ row }) => {
                return (
                    row?.original?.type
                )
            }
        },
        {
            id: 'message',
            accessorKey: 'Message',
            size: 600,
            cell: ({ row }) => {
                return (
                    <small className='line-clamp-2'>
                        {row?.original?.message}
                    </small>
                )
            }
        },
        {
            id: 'status',
            accessorKey: 'Status',
            size: 120,
            cell: ({ row }) => {
                return (
                    <InfoBadge status={row?.original?.status} />
                )
            }
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        {row?.original?.status === 'Waiting' &&
                            <LinkButton href={`/admin/hrsystem/requests/${row?.original?.id}`} />
                        }
                    </div>
                )
            },
            size: 120,
        },

    ]
}