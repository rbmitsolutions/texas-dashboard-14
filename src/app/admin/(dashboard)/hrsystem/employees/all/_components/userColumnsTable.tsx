"use client"

//components
import UserDisplay from "@/components/common/userDisplay"
import LinkButton from "@/components/common/linkButton"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

//interface
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { IUser } from "@/common/types/user/user.interface"

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
        accessorKey: "name",
        size: 40,
        header: () => <div className="text-left">Avatar</div>,
        cell: ({ row }) => {
            return (
                <UserDisplay
                    user={{
                        name: row?.original?.name || '',
                        profile_image: row?.original?.profile_image as string
                    }}
                    displayClass="h-10 w-10"
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
                    <LinkButton
                        href={`${RedirectTo.USER_PROFILE}/${row?.original?.id}`}
                    />
                </div>
            )
        },
        size: 40,
    },

]