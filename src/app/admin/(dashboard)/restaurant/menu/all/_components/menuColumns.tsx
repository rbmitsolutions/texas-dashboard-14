"use client"
import { ColumnDef } from "@tanstack/react-table"
import { IMenu } from "@/common/types/restaurant/menu.interface"
import Image from "next/image"
import { ImagesPath } from "@/common/types/imges"
import { cn } from "@/common/libs/shadcn/utils"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"
import Link from "next/link"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface MenuColumnsTableProps {
    redirectTo: (path: string) => void
}

export const menuColumnsTable = ({
    redirectTo
}: MenuColumnsTableProps): ColumnDef<IMenu>[] => {
    return [
        {
            id: "thumbnail",
            accessorKey: "Thumbnail",
            size: 40,
            cell: ({ row }) => {
                return (
                    <Image
                        alt={`menu-${row?.original?.title} thumbnail`}
                        src={row?.original?.thumbnail || ImagesPath['NO_IMAGE']}
                        width={40}
                        height={40}
                        className={cn('rounded-md', !row?.original?.thumbnail && 'grayscale opacity-20')}
                    />
                )
            }
        },
        {
            id: "title",
            accessorKey: "Title",
            size: 120,
            cell: ({ row }) => {
                return (
                    row?.original?.title
                )
            }
        },
        {
            id: "type",
            accessorKey: "Type",
            size: 80,
            cell: ({ row }) => {
                return (
                    row?.original?.mn_type?.title
                )
            }
        },
        {
            id: "description",
            accessorKey: "Description",
            // cell: ({ row }) => {
            //     return (
            //         <h2>{row?.original?.types?.length} linked</h2>
            //     )
            // },
            cell: ({ row }) => {
                return (
                    row?.original?.description
                )
            },
            size: 400,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <Button
                            variant='orange'
                            size='iconSm'
                            onClick={() => redirectTo(`/admin/restaurant/menu/all/${row?.original?.id}`)}
                        >

                            <Icon name="Pen" size={12} />
                        </Button>
                        {/* <DeleteDialogButton
                            onDelete={() => onDelete(row?.original?.id)}
                            isDisabled={row?.original?.types?.length > 0}
                        /> */}
                    </div>
                )
            },
            size: 120,
        },

    ]
}