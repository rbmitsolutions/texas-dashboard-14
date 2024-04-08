"use client"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { IReviews } from "@/common/types/restaurant/bookings.interface"
import InfoBadge from "@/components/common/infoBadge"
import { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/common/libs/shadcn/utils"
import { getReviewColor } from "@/common/libs/restaurant/reviews"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImagesPath } from "@/common/types/imgs"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const reviewsColumnsTable: ColumnDef<IReviews>[] = [
    {
        accessorKey: "profile_image",
        size: 40,
        header: () => <div className="text-left ">Avatar</div>,
        cell: ({ row }) => {
            const name = row.getValue('name') as string || ''
            return (
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={'' || ImagesPath.NO_IMAGE} alt={row.getValue('name') || 'no-image'} />
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
                    {row?.original?.client?.name?.toLowerCase() || 'Walk-in'} 
                </div>
            )
        }
    },
    {
        accessorKey: "date",
        header: () => <div className="text-left max-w-48">Date</div>,
        size: 40,
        cell: ({ row }) => {
            return (
                <div>
                    {formatDate({
                        date: row?.original?.date,
                        f: 'dd/MM/yyyy'
                    })}
                </div>
            )
        }
    },
    {
        accessorKey: "type",
        header: () => <div className="text-left">Type</div>,
        size: 80,
        cell: ({ row }) => {
            return (
                <div>
                    <InfoBadge status={row?.original?.type} />
                </div>
            )
        }
    },
    {
        accessorKey: "description",
        header: () => <div className="text-left">Description</div>,
        size: 150,
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-6 text-justify'>
                    {row?.original?.type === 'restaurant' ?
                        <>
                            <p>Food:&nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.food.toFixed(2)))}>{Number(row?.original?.review?.food.toFixed(2))}</strong>
                            </p>
                            <p>Service: &nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.service.toFixed(2)))}>{Number(row?.original?.review?.service.toFixed(2))}
                                </strong>
                            </p>
                            <p>Ambiance:&nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.ambiance.toFixed(2)))}>{Number(row?.original?.review?.ambiance.toFixed(2))}
                                </strong>
                            </p>

                        </>
                        :
                        <>
                            <p>Welcoming:&nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.welcoming.toFixed(2)))}>{Number(row?.original?.review?.welcoming.toFixed(2))}</strong>
                            </p>
                            <p>Knowledge: &nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.knowledge.toFixed(2)))}>{Number(row?.original?.review?.knowledge.toFixed(2))}
                                </strong>
                            </p>
                            <p>Requests:&nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.requests.toFixed(2)))}>{Number(row?.original?.review?.requests.toFixed(2))}
                                </strong>
                            </p>
                            <p>Timing:&nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.timing.toFixed(2)))}>{Number(row?.original?.review?.timing.toFixed(2))}
                                </strong>
                            </p>
                            <p>Atmosphere:&nbsp;
                                <strong className={getReviewColor(Number(row?.original?.review?.atmosphere.toFixed(2)))}>{Number(row?.original?.review?.atmosphere.toFixed(2))}
                                </strong>
                            </p>

                        </>
                    }
                </div>
            )
        }
    },
    {
        accessorKey: "comment",
        header: () => <div className="text-left">Comment</div>,
        size: 400,
        cell: ({ row }) => {
            return (
                <div>
                    {row?.original?.review?.comment}
                </div>
            )
        }
    },
    {
        accessorKey: "total",
        header: () => <div className="text-left">Total</div>,
        size: 80,
        cell: ({ row }) => {
            const value = Number(row?.original?.total.toFixed(2)) || 0
            const color = getReviewColor(value)
            return (
                <div className={cn('flex items-center gap-2 line-clamp-1', color)}>
                    <strong>
                        {value}
                    </strong>
                </div>
            )
        }
    },
]