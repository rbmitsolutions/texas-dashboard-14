'use client'
import { useState } from "react";
import { UseMutateFunction } from "react-query";

//component
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

//interface 
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { ITable } from "@/common/types/restaurant/tables.interface";

interface ChangeGuestsProps {
    table: ITable
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function ChangeGuests({ table, updateTable }: ChangeGuestsProps) {
    const [guests, setGuests] = useState<number>(table?.guests_booked)
    const [isOpen, setIsOpen] = useState(false)

    const onOpenChange = () => {
        setGuests(table?.guests_booked)
        setIsOpen(!isOpen)
    }

    const onTableUpdate = async () => {

        await updateTable({
            table: {
                id: table?.id,
                guests_booked: guests,
            },
        }, {
            onSuccess: () => {
                onOpenChange()
            }
        })
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <Button
                    variant='purple'
                    leftIcon='Users'
                    size='sm'
                    onClick={onOpenChange}
                >
                    {table?.guests_booked}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    Guests
                </DialogHeader>
                <div className='flex-col-container gap-4 overflow-auto'>
                    <div className='overflow-auto scrollbar-thin'>
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
                </div>
                <DialogFooter
                    className="w-full"
                >
                    <Button
                        leftIcon="RefreshCcw"
                        variant='orange'
                        disabled={guests === table?.guests_booked}
                        onClick={onTableUpdate}
                    >
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}