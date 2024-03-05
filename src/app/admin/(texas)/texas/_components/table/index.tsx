import TablesStatus from "./tableStatus"
import { UseMutateFunction } from "react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"
import { getWalkInClient } from "./utils"

//components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getCurretBookingTime } from "../../bookings/_components/utils"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import IconText from "@/components/common/iconText"
import { Button } from "@/components/ui/button"

//store
import { TransactionsState } from "@/store/company/transactions"

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { TransactionsStatus } from "@/common/types/company/transactions.interface"
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { ITimesOpen } from "@/common/types/restaurant/config.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"

interface TableProps {
    table: ITable
    waitres?: {
        createBooking: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
        emit: (data: ISocketMessage) => void
        timesOpen: ITimesOpen[]
        updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    }
    reception?: {
        getTotalOfOrdersByTableId: (table_id: string) => number
        getTransactionsTotalByFilter: (data: TransactionsState['transactionFilter']) => number
    }
}

export default function Table({ table, waitres, reception }: TableProps) {
    const { push } = useRouter()

    const handleOpenTable = async () => {
        if (waitres) {
            const walkInClient = await getWalkInClient()
            const currentTime = getCurretBookingTime(waitres?.timesOpen)

            if (!currentTime) return toast.error('Restaurant is closed')

            await waitres.createBooking({
                booking: {
                    amount_of_people: table?.guests,
                    contact_number: walkInClient?.contact_number,
                    date: new Date(),
                    email: walkInClient?.email,
                    name: walkInClient?.name,
                    status: 'walk_in',
                    time: currentTime?.title,
                    valid_number: false,
                    table_id: table?.id,
                },
            }, {
                onSuccess: async () => {
                    await waitres.emit({
                        event: SocketIoEvent.BOOKING,
                    })
                    await waitres.emit({
                        event: SocketIoEvent.TABLE,
                    })
                    push(`${RedirectTo.TABLE_ORDER}/${table?.id}`)
                }

            })
        }
    }


    return (
        <div className='flex gap-2 min-h-40 bg-background-soft rounded-lg'>
            <div className={cn('flex-col-container w-10 py-1 items-center justify-between rounded-l-lg', table?.is_open ? 'bg-green-500 dark:bg-green-700' : 'bg-red-400 dark:bg-red-800')}>
                <small>{table?.number}</small>
                <IconText
                    icon="Users"
                    text={table?.guests}
                    className="flex flex-col-reverse gap-1 mb-1"
                />
            </div>
            {waitres && (
                table?.is_open ?
                    <div className='flex-col-container justify-between gap-2 p-2 w-full'>
                        <Link className='flex flex-col gap-1 h-full w-full' href={`/admin/texas/waiters/${table?.id}`}>
                            <strong className='capitalize text-sm'>{table?.client_name?.toLowerCase() || 'Walk In'}</strong>
                            <IconText
                                icon="Clock"
                                text={formatDate({
                                    date: table?.start_time,
                                    f: 'HH:mm:ss',
                                    iso: false
                                })}
                                iconSize={14}
                            />
                            {/* //todo  add orders */}
                            {/* <IconText
                            icon="Clock"
                            text={formatDate({
                                date: table?.start_time,
                                f: 'HH:mm:ss'
                            })}
                              iconSize={14}
                        /> */}
                            <IconText
                                icon="Utensils"
                                text={`Pass ${table?.pass}`}
                                iconSize={14}
                            />
                        </Link>
                        <TablesStatus
                            table={table}
                            updateTable={waitres.updateTable}
                            emit={waitres.emit}
                        />
                    </div>
                    :
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='h-full w-full'
                                leftIcon='Footprints'
                            >
                                Open
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Open table ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    A new booking will be created as a walk in client!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    asChild
                                >
                                    <Button
                                        variant='pink'
                                        onClick={handleOpenTable}
                                        leftIcon="Footprints"
                                    >
                                        Walk In
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
            )}

            {reception && table?.is_open &&
                <Link className='flex flex-col justify-between gap-1 h-full w-full p-2' href={`/admin/texas/reception/${table?.id}`}>
                    <div className='flex flex-col gap-1'>
                        <strong className='capitalize text-sm'>{table?.client_name?.toLowerCase() || 'Walk In'}</strong>
                        <IconText
                            icon="Clock"
                            text={formatDate({
                                date: table?.start_time,
                                f: 'HH:mm:ss',
                                iso: false
                            })}
                            iconSize={14}
                        />
                        <small>{convertCentsToEuro(reception?.getTotalOfOrdersByTableId(table?.id))} - Total</small>
                        <small>{convertCentsToEuro(reception?.getTransactionsTotalByFilter({
                            payee_key: table?.id,
                            status: TransactionsStatus.CONFIRMED
                        }))} - Paid</small>
                    </div>
                    <strong className='text-xl'>{convertCentsToEuro(reception?.getTotalOfOrdersByTableId(table?.id) - reception?.getTransactionsTotalByFilter({
                        payee_key: table?.id,
                        status: TransactionsStatus.CONFIRMED
                    }))}</strong>
                </Link>
            }

            {reception && !table?.is_open &&
                <div className='flex-container items-center justify-center w-full'>
                    <small className='text-foreground/30'>
                        <i >Table is Close</i>
                    </small>
                </div>
            }

        </div>
    )
}