'use client'
import { UseMutateFunction } from "react-query"
import toast from "react-hot-toast"
import { useState } from "react"

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
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { ITimesOpen } from "@/common/types/restaurant/config.interface"

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
    const [guests, setGuests] = useState<number>(2)

    const handleOpenTable = async () => {
        const walkInClient = await getWalkInClient()
        const currentTime = getCurretBookingTime(timesOpen)

        if (!currentTime) return toast.error('Restaurant is closed')

        await createBooking({
            booking: {
                amount_of_people: guests,
                contact_number: walkInClient?.contact_number,
                date: new Date(),
                email: walkInClient?.email,
                name: walkInClient?.name,
                status: 'walk_in',
                time: currentTime?.title,
                valid_number: false,
                table_id: table?.id,
            },
        })
    }

    const handleOpenWithNoBooking = async () => {
        await updateTable({
            table: {
                id: table?.id,
                is_open: true,
                start_time: new Date(),
                guests_booked: guests,
                client_name: 'Client Not Registered',
                client_id: 'Client Not Registered',
                meal_status: TableMealStatus.WAITING,
            }
        })

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
                <div className='overflow-auto scrollbar-thin'>
                    <strong>Guests</strong>
                    <div className='flex gap-2 py-2'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18]?.map(g => {
                            return (
                                <Button
                                    key={g}
                                    className='h-12 min-w-16'
                                    variant={guests === g ? 'default' : 'outline'}
                                    onClick={() => setGuests(g)}
                                >
                                    {g}
                                </Button>
                            )
                        })}
                    </div>
                </div>
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