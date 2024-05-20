"use client"
import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query"

//libs
import { getReviewColor } from "@/common/libs/restaurant/reviews"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { cn } from "@/common/libs/shadcn/utils"

//components
import EditUserProfileDialog from "@/app/admin/(dashboard)/restaurant/clients/_components/editUserProfileDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LinkButton from "@/components/common/linkButton"


//interface
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IClientSchema } from "@/common/libs/zod/forms/restaurant/clientsForm"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface ClientsColumnsTableProps {
    isUpdateClientLoading: boolean
    updateClient: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export const clientsColumnsTable = ({ updateClient, isUpdateClientLoading }: ClientsColumnsTableProps): ColumnDef<IClientSchema>[] => {
    return [
        {
            accessorKey: "profile_image",
            size: 40,
            header: () => <div className="text-left ">Avatar</div>,
            cell: ({ row }) => {
                const name = row.getValue('name') as string || ''
                return (
                    <Avatar className='h-8 w-8'>
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
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {row?.original?.name?.toLowerCase()}
                    </div>
                )
            }
        },
        {
            accessorKey: "email",
            header: () => <div className="text-left">Email</div>,
            size: 200
        },
        {
            accessorKey: "contact_number",
            header: () => <div className="text-left">Contact Number / Irish</div>,
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center gap-2'>
                        {row?.original?.contact_number} <div
                            className={cn('h-3 w-3 rounded-full', row?.original?.valid_number ? 'bg-green-500' : 'bg-red-500')}
                        />
                    </div>
                )
            }
        },
        {
            accessorKey: "qnt_of_bookings",
            header: () => <div className="text-left">Bookings</div>,
            size: 80,

        },
        {
            accessorKey: "restaurant_review",
            header: () => <div className="text-left">Restaurant Reviews</div>,
            size: 80,
            cell: ({ row }) => {
                const value = Number(row?.original?.restaurant_review.toFixed(2)) || 0
                const color = getReviewColor(value)
                return (
                    <div className={cn('flex items-center gap-2 line-clamp-1', color)}>
                        {value === 0 ? 'No reviews' : value}
                    </div>
                )
            }
        },
        {
            accessorKey: "staff_review",
            header: () => <div className="text-left">Staff Reviews</div>,
            size: 80,
            cell: ({ row }) => {
                const value = Number(row?.original?.staff_review.toFixed(2)) || 0
                const color = getReviewColor(value)
                return (
                    <div className={cn('flex items-center gap-2 line-clamp-1', color)}>
                        {value === 0 ? 'No reviews' : value}
                    </div>
                )
            }
        },
        {
            accessorKey: "spent",
            header: () => <div className="text-left">Spent</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center gap-2'>
                        {convertCentsToEuro(row?.original?.spent || 0)}
                    </div>
                )
            }
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <EditUserProfileDialog
                            client={row?.original}
                            isUpdateClientLoading={isUpdateClientLoading}
                            udpateClient={updateClient}
                        />
                        <LinkButton
                            href={`/admin/restaurant/clients/${row?.original?.id}/bookings`}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}