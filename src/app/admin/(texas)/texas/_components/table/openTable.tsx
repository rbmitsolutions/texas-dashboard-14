'use client'
import { UseMutateFunction } from "react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

//libs
import { getWalkInClient } from "@/common/libs/restaurant/actions/walkinClients"
import { getCurretBookingTime } from "@/common/libs/restaurant/timesOpen"

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
import { Button } from "@/components/ui/button"

//interface 
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { ITimesOpen } from "@/common/types/restaurant/config.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface"

interface OpenTableDialogProps {
    table: ITable
    timesOpen: ITimesOpen[]
    createBooking: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function OpenTableDialog({
    table,
    timesOpen,
    createBooking,
    updateTable
}: OpenTableDialogProps) {
    const { push } = useRouter()

    const handleOpenTable = async () => {
        const walkInClient = await getWalkInClient()
        const currentTime = getCurretBookingTime(timesOpen)

        if (!currentTime) return toast.error('Restaurant is closed')

        await createBooking({
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
                push(`${RedirectTo.TABLE_ORDER}/${table?.id}`)
            }

        })
    }

    const handleOpenWithNoBooking = async () => {

        await updateTable({
            table: {
                id: table?.id,
                is_open: true,
                start_time: new Date(),
                client_name: 'Client Not Registered',
                client_id: 'Client Not Registered',
                meal_status: TableMealStatus.WAITING,
            }
        })
        push(`${RedirectTo.TABLE_ORDER}/${table?.id}`)
    }

    return (
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
                <AlertDialogFooter
                    className='flex !justify-between w-full'
                >
                    <AlertDialogAction
                        asChild
                    >
                        <Button
                            onClick={handleOpenWithNoBooking}
                            leftIcon="Dice4"
                            className='!bg-zinc-100 dark:!bg-zinc-800 dark:!text-white'
                        >
                            Open Table
                        </Button>
                    </AlertDialogAction>
                    <div className='flex-container gap-4'>
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
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}