import { useState } from "react"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import { Button } from "@/components/ui/button"

//interface
import { IBookingPageResponse, IGETBookingsPageReturn, IGETSpareTablesReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISpareTablesFilter, filterSpareTables, getBookingAmountPerTable } from "./utils"

interface SelectTableProps {
    sections: IBookingPageResponse['sections_open']
    tables: IGETSpareTablesReturn[]
    tableSelected?: IGETSpareTablesReturn
    setTableSelected: React.Dispatch<React.SetStateAction<IGETSpareTablesReturn>>
    booking?: IGETBookingsPageReturn
}

export default function SelectTable({
    sections,
    booking,
    tables,
    tableSelected,
    setTableSelected
}: SelectTableProps) {
    const [spareTablesFilter, setSpareTablesFilter] = useState<ISpareTablesFilter>({
        section: '',
        guests: getBookingAmountPerTable(booking?.amount_of_people || 2)
    })

    return (
        <>
            <div className='grid grid-cols-4 gap-2'>
                {sections?.map(section => {
                    return (
                        <Button
                            key={section?.id}
                            variant={spareTablesFilter?.section?.includes(section?.id) ? 'default' : 'outline'}
                            onClick={() => {
                                setSpareTablesFilter(prev => ({
                                    ...prev,
                                    section: section?.id === prev?.section ? '' : section?.id
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
                {
                    filterSpareTables(spareTablesFilter, tables)?.map(table => {
                        return (
                            <div
                                key={table?.id}
                                className={cn('flex-col-container items-center justify-center p-2 rounded-lg border-2 gap-1 min-h-20 cursor-pointer', tableSelected?.id === table?.id ? 'bg-background-soft border-primary' : 'bg-background')}
                                onClick={() => setTableSelected(prev => {
                                    if (prev?.id === table?.id) {
                                        return booking?.table as unknown as IGETSpareTablesReturn
                                    } else {
                                        return table
                                    }
                                })}
                            >
                                <small>
                                    {table?.section?.title} - {table?.number}
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