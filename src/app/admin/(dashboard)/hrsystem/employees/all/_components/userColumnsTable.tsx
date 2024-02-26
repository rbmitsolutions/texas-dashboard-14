"use client"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { IUser } from "@/common/types/user/user.interface"
import LinkButton from "@/components/common/linkButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const userColumnsTable: ColumnDef<IUser>[] = [
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
                    <LinkButton 
                        href={`${RedirectTo.USER_PROFILE}/${row?.original?.id}`}
                    />
                </div>
            )
        },
        size: 40,
    },

]