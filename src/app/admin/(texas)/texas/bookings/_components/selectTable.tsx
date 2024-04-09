import { Dispatch, SetStateAction, useState } from "react"

//libs
import { getBookingAmountPerTable } from "@/common/libs/restaurant/bookings"

//components
import { Button } from "@/components/ui/button"

//store
import { useSectionsStore } from "@/store/restaurant/sections"

//interface
import { IGETSpareTablesReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISection, ITable } from "@/common/types/restaurant/tables.interface"
import { IBookings } from "@/common/types/restaurant/bookings.interface"

interface ISpareTables {
    section: ISection | undefined,
    guests: number
    ppl: number
}
interface SelectTableProps {
    sections?: ISection[]
    tableSelected?: IGETSpareTablesReturn
    setTableSelected: Dispatch<SetStateAction<ITable | undefined>>
    booking?: IBookings
    tableByGuests?: (ppl: number) => void
}

export default function SelectTable({
    sections,
    booking,
    tableSelected,
    setTableSelected,
    tableByGuests
}: SelectTableProps) {
    const { sections: sec } = useSectionsStore()
    const [spareTablesFilter, setSpareTablesFilter] = useState<ISpareTables>({
        section: sections ? sections[0] : sec[0],
        guests: getBookingAmountPerTable(booking?.amount_of_people || 2),
        ppl: booking?.amount_of_people || 2
    })

    const getTables = () => {
        let tables = spareTablesFilter?.section?.tables

        if (tables) {
            tables = tables.filter(table => !table?.is_open)
        }

        if (tables) {
            tables = tables.filter(table => table?.guests === spareTablesFilter?.guests)
        }

        return tables
    }

    const allSec = sections || sec

    return (
        <>
            <div className='grid grid-cols-4 gap-2'>
                {allSec?.map(section => {
                    return (
                        <Button
                            key={section?.id}
                            variant={spareTablesFilter?.section?.id?.includes(section?.id) ? 'default' : 'outline'}
                            onClick={() => {
                                setSpareTablesFilter(prev => ({
                                    ...prev,
                                    section
                                }))
                            }}
                            className='p-1 h-8 text-sm'
                        >
                            {section?.title}
                        </Button>
                    )
                })}
            </div>
            {tableByGuests ?
                <div className='flex gap-2 overflow-auto scrollbar-thin'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18]?.map(g => {
                        return (
                            <Button
                                key={g}
                                className='h-12 min-w-16'
                                variant={spareTablesFilter?.ppl === g ? 'default' : 'outline'}
                                onClick={() => {
                                    setSpareTablesFilter(prev => ({
                                        ...prev,
                                        guests: getBookingAmountPerTable(g),
                                        ppl: g
                                    }))
                                    tableByGuests(g)
                                }}
                            >
                                {g}
                            </Button>
                        )
                    })}
                </div>
                :
                <div className='grid grid-cols-4 gap-2'>
                    {[2, 4, 6, 8]?.map(g => {
                        return (
                            <Button
                                key={g}
                                className='h-12'
                                variant={spareTablesFilter?.guests === g ? 'default' : 'outline'}
                                onClick={() => {
                                    setSpareTablesFilter(prev => ({
                                        ...prev,
                                        guests: g
                                    }))
                                }}
                            >
                                {g}
                            </Button>
                        )
                    })}
                </div>
            }
            <div className='grid grid-cols-2 gap-2 p-2 bg-background-soft scrollbar-thin overflow-auto'>
                {getTables()?.map(table => {
                    return (
                        <Button
                            key={table?.id}
                            className='flex-col-container items-center justify-center p-2 gap-1 min-h-20 cursor-pointer'
                            variant={tableSelected?.id === table?.id ? 'default' : 'outline'}
                            onClick={() => setTableSelected(prev => {
                                if (prev?.id === table?.id) {
                                    return booking?.table
                                } else {
                                    return table
                                }
                            })}
                        >
                            <strong>
                                Table - {table?.number}
                            </strong>
                            <small>
                                {table?.guests} Guests
                            </small>
                        </Button>
                    )
                })}
            </div>
        </>
    )
}