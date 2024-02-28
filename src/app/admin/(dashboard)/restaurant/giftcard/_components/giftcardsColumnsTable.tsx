"use client"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import InfoBadge from "@/components/common/infoBadge"
import { ColumnDef } from "@tanstack/react-table"
import GiftcardDialog from "./giftcardDialog"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { UseMutateFunction } from "react-query"
import LinkButton from "@/components/common/linkButton"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { IToken } from "@/common/types/auth/auth.interface"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
interface GiftcardsColumnsTableProps {
    updateGiftcard: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>,
    user: IToken
}

export const giftcardsColumnsTable = ({
    updateGiftcard,
    user
}: GiftcardsColumnsTableProps): ColumnDef<IGiftCards>[] => {
    return [
        {
            accessorKey: "code",
            size: 160,
            header: () => <div className="text-left ">Code</div>,
            cell: ({ row }) => {
                return (
                    <div>
                        {row?.original?.code || 'N/A'}
                    </div>
                )
            }
        },
        {
            accessorKey: "created_at",
            size: 120,
            header: () => <div className="text-left ">Date</div>,
            cell: ({ row }) => {
                return (
                    <div>
                        {formatDate({
                            date: row?.original?.created_at,
                            f: 'dd, LLL, yy'
                        })}
                    </div>
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
            size: 180
        },
        {
            accessorKey: "to",
            header: () => <div className="text-left">To</div>,
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {row?.original?.name_to?.toLowerCase()}
                    </div>
                )
            },
            size: 200
        },
        {
            accessorKey: "value",
            header: () => <div className="text-left">Value</div>,
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {convertCentsToEuro(row?.original?.value)}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "spent",
            header: () => <div className="text-left">Spent</div>,
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {convertCentsToEuro(row?.original?.spent)}
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "status",
            header: () => <div className="text-left">Status</div>,
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        <InfoBadge
                            status={row?.original?.status}
                        />
                    </div>
                )
            },
            size: 100
        },
        {
            accessorKey: "sent_by",
            header: () => <div className="text-left">Sent By</div>,
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {row?.original?.sent_by || 'unsent'}
                    </div>
                )
            },
            size: 120
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <GiftcardDialog
                            giftcard={row?.original}
                            updateGiftcard={updateGiftcard}
                            user={user}
                        />
                        {row?.original?.client_key &&
                            <LinkButton
                                icon='User'
                                href={RedirectTo.CLIENT_PROFILE + '/' + row?.original?.client_key + '/bookings'}
                            />
                        }
                    </div>
                )
            },
            size: 40,
        },

    ]
}