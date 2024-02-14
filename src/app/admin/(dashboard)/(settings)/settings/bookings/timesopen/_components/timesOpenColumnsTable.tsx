"use client"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { IBookingDays, ITimesOpen } from "@/common/types/restaurant/config.interface"
import { compareAscDate, parseISODate } from "@/common/libs/date-fns/dateFormat"

interface TimesOpenColumnsTableProps {
    // daysOpen: IBookingDays[]
    // addTable: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    // deleteTable: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    // deleteSection: UseMutateFunction<void, any, IDELETERestaurantDataBody, unknown>
    // editSection: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//todo: finish times open
const sortByOpenTime = (array: ITimesOpen[]) => {
    array.sort((a, b) => {
        const timeA = parseISODate(`2000-01-01T${a.open}`);
        const timeB = parseISODate(`2000-01-01T${b.open}`);
        return compareAscDate(timeA, timeB);
    });

    return array;
}


export const timesOpenColumnsTable = ({
    // addTable,
    // deleteTable,
    // deleteSection,
    // editSection,
    // daysOpen
}: TimesOpenColumnsTableProps): ColumnDef<IBookingDays>[] => {
    return [
        {
            accessorKey: "day",
            header: () => <div className="text-left max-w-48">Day</div>,
            size: 60
        },
        {
            accessorKey: "times_open",
            header: () => <div className="text-left">Times Open</div>,
            size: 800,
            cell: ({ row }) => {
                return (
                    <div className='flex items-center flex-wrap gap-4'>
                        {row?.original?.times_open?.length <= 0 &&
                            <i className='text-foreground/20'>No Times Open</i>
                        }
                        {sortByOpenTime(row?.original?.times_open)?.map((time) => {
                            return (
                                <Badge
                                    key={time?.id}
                                >
                                    {time?.title}
                                </Badge>
                            )
                        })}
                        {/* <Button
                            size='iconExSm'
                            disabled={row?.original?.priority === 1}
                            onClick={async () => await editSection({
                                section: {
                                    id: row?.original?.id,
                                    priority: row?.original?.priority - 1
                                }
                            })}
                        >
                            <Icon name='Minus' />
                        </Button>
                        {row?.original?.priority}
                        <Button
                            size='iconExSm'
                            disabled={row?.original?.priority === 3}
                            onClick={async () => await editSection({
                                section: {
                                    id: row?.original?.id,
                                    priority: row?.original?.priority + 1
                                }
                            })}
                        >
                            <Icon name='Plus' />
                        </Button> */}
                    </div>
                )
            }
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-left">Actions</div>,
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        {/* <AddTable
                            addTable={addTable}
                            section={row?.original}
                        />
                        <Button
                            size='iconExSm'
                            onClick={async () => await deleteSection({
                                section: {
                                    id: row?.original?.id

                                }
                            })}
                            disabled={row?.original?.tables?.length > 0}
                            variant='destructive'
                        >
                            <Icon name='Trash2' />
                        </Button> */}
                    </div>
                )
            },
        },
    ]
}