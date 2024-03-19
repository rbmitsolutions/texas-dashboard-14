//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

//interface
import { IFinishedTable } from "@/common/types/restaurant/tables.interface"
import IconText from "@/components/common/iconText"

interface ClosedTablesProps {
    finishedTables: IFinishedTable[]
}

export default function ClosedTables({ finishedTables }: ClosedTablesProps) {
    console.log(finishedTables)
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant='pink'
                    className='w-full h-16'
                >
                    <Icon name='UtensilsCrossed' />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Last Orders</SheetTitle>
                </SheetHeader>
                <div className="flex-col-container gap-2 overflow-auto scrollbar-thin">
                    {finishedTables?.map(table => {
                        return (
                            <div
                                key={table?.id}
                                className='flex-col-container gap-2 bg-background-soft p-2 rounded-lg'
                            >
                                <strong>{formatDate({
                                    date: table?.date,
                                    f: 'dd/MM/yyyy'
                                })}</strong>
                                <IconText
                                    icon="Users"
                                    text={table?.guests}
                                />
                                <strong>{formatDate({
                                    date: table?.start_time,
                                    f: 'HH:mm:ss'
                                })}</strong>
                                <strong>{formatDate({
                                    date: table?.end_time,
                                    f: 'HH:mm:ss'
                                })}</strong>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}