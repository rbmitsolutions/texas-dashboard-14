"use client"

import Icon from "@/common/libs/lucida-icon"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { IUser } from "@/common/types/user/user.interface"
import UserDisplay from "@/components/common/userDisplay"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const filledUserColumnsTable: ColumnDef<IUser>[] = [
    {
        accessorKey: "status",
        header: "Status",
        size: 40,
    },
    {
        accessorKey: "profile_image",
        size: 200,
        header: () => <div className="text-left">Avatar</div>,
        cell: ({ row }) => {
            return (
                <UserDisplay
                    user={{
                        name: row?.original?.name || '',
                        profile_image: row?.original?.profile_image as string
                    }}
                    displayClass="h-12 w-12"
                />
            )
        }
    },
    {
        accessorKey: "email",
        header: () => <div className="text-left">Email</div>,
        size: 300
    },
    {
        accessorKey: "role_id",
        header: "Role",
        cell: ({ row }) => {
            return (
                <div className="flex-container-center">
                    {row?.original?.role?.title}
                </div>
            )
        },
        size: 150
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex-container-center">
                    <Link
                        className='flex items-center justify-center bg-primary text-primary-foreground shadow hover:bg-primary/80 rounded-md h-7 w-7'
                        href={`${RedirectTo.USER_PROFILE}/${row?.original?.id}`}>
                        <Icon name='ChevronRight' size={16} />
                    </Link>
                </div>
            )
        },
        size: 40,
    },

]

