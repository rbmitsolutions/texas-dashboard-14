'use client'
import { Dispatch, SetStateAction } from "react"
import Link from "next/link"

//libs
import { addDaysToDate, convertMinutesToHoursAndMinutes, formatDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Pagination from "@/components/common/pagination"
import IconText from "@/components/common/iconText"
import { Button } from "@/components/ui/button"

//interface
import { IFinishedTableAllResponse, IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"

interface ClosedTablesProps {
    finishedTables: IFinishedTableAllResponse
    setFinishedTablesParams: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
    finishedTablesParams: IGETRestaurantDataQuery
}

export default function ClosedTables({ finishedTables, setFinishedTablesParams, finishedTablesParams }: ClosedTablesProps) {
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
                    <SheetTitle>Closed Tables</SheetTitle>
                    <div className='flex-container p-4 justify-center'>
                        <Pagination
                            onPageChange={(pagination) => setFinishedTablesParams(prev => ({
                                finishedTables: {
                                    all: {
                                        ...prev?.finishedTables?.all,
                                        date: {
                                            gte: getFirstTimeOfTheDay(new Date()),
                                            lte: addDaysToDate(new Date(), 1)
                                        },
                                        pagination
                                    }
                                }
                            }))}
                            queryPagination={finishedTablesParams?.finishedTables?.all?.pagination!}
                            pagination={finishedTables?.pagination}
                        />
                    </div>
                </SheetHeader>
                <div className="flex-col-container gap-2 overflow-auto scrollbar-thin">
                    {finishedTables?.data?.map(table => {
                        return (
                            <Link
                                href={`${RedirectTo.FINISHED_TABLE}/${table?.id}`}
                                key={table?.id}
                                className='flex-col-container gap-2 bg-background-soft p-4 border-2 rounded-lg'
                            >
                                <strong>{formatDate({
                                    date: table?.date,
                                    f: 'dd/MM/yyyy',
                                })}</strong>
                                <div className='grid-container grid-cols-2'>
                                    <IconText
                                        icon="Users"
                                        text={table?.client}
                                    />
                                    <IconText
                                        icon="Users"
                                        text={table?.guests}
                                    />
                                </div>
                                <div className='grid-container grid-cols-2'>
                                    <IconText
                                        icon="Clock"
                                        text={formatDate({
                                            date: table?.start_time,
                                            f: 'HH:mm:ss',
                                            iso: false
                                        })}
                                    />
                                    <IconText
                                        icon="Clock"
                                        text={convertMinutesToHoursAndMinutes(table?.average_minutes)}
                                    />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}