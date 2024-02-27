import { Dispatch, SetStateAction, useState } from "react"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import { Button } from "@/components/ui/button"

//interface
import { IGETSpareTablesReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { getBookingAmountPerTable } from "./utils"
import { IBookings } from "@/common/types/restaurant/bookings.interface"
import { ISection, ITable } from "@/common/types/restaurant/tables.interface"

interface ISpareTables {
    section: ISection | undefined,
    guests: number
}
interface SelectTableProps {
    sections: ISection[]
    tableSelected?: IGETSpareTablesReturn
    setTableSelected: Dispatch<SetStateAction<ITable | undefined>>
    booking?: IBookings
}

export default function SelectTable({
    sections,
    booking,
    tableSelected,
    setTableSelected
}: SelectTableProps) {
    const [spareTablesFilter, setSpareTablesFilter] = useState<ISpareTables>({
        section: sections[0],
        guests: getBookingAmountPerTable(booking?.amount_of_people || 2)
    })

    const getOpenAndFIlteredTables = () => {
        let tables = spareTablesFilter?.section?.tables

        if(tables) {
            tables = tables.filter(table => !table?.is_open)
        }

        if (tables) {
            tables = tables.filter(table => table?.guests === spareTablesFilter?.guests)
        }

        return tables
    }

    return (
        <>
            <div className='grid grid-cols-4 gap-2'>
                {sections?.map(section => {
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
                            {g} pp
                        </Button>
                    )
                })}
            </div>
            <div className='grid grid-cols-2 gap-2 p-2 bg-background-soft scrollbar-thin overflow-auto'>
                {getOpenAndFIlteredTables()?.map(table => {
                    return (
                        <div
                            key={table?.id}
                            className={cn('flex-col-container items-center justify-center p-2 rounded-lg border-2 gap-1 min-h-20 cursor-pointer', tableSelected?.id === table?.id ? 'bg-background-soft border-primary' : 'bg-background')}
                            onClick={() => setTableSelected(prev => {
                                if (prev?.id === table?.id) {
                                    return booking?.table 
                                } else {
                                    return table
                                }
                            })}
                        >
                            <small>
                                Table - {table?.number}
                            </small>
                            <small>
                                {table?.guests} Guests
                            </small>
                        </div>
                    )
                })}
            </div>
        </>
    )
}