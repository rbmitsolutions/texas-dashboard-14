'use client'
import { useState } from "react"
import Link from "next/link"

//libs
import { addDaysToDate, convertMinutesToHoursAndMinutes, formatDate, getFirstTimeOfTheDay, subDaysToDate } from "@/common/libs/date-fns/dateFormat"
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

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import PrintBill from "../../reception/_components/rightReceptionDisplay/printBillButton"

interface FinishedTablesProps {
    tableId: string
}

export default function FinishedTables({ tableId }: FinishedTablesProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const {
        restaurantAllFinishedTables: finishedTables,
        GETRestaurantDataParams: finishedTablesParams,
        setGETRestaurantDataParams: setFinishedTablesParams,
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                all: {
                    date: {
                        gte: subDaysToDate(new Date(), 7),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    pagination: {
                        take: 10,
                        skip: 0
                    },
                    table_id: tableId
                }
            }
        },
        UseQueryOptions: {
            enabled: (isOpen && tableId) ? true : false,
        }
    })

    return (
        <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SheetTrigger asChild>
                <Button
                    size='sm'
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
                                            gte: subDaysToDate(new Date(),7),
                                            lte: addDaysToDate(new Date(), 1)
                                        },
                                        pagination,
                                        table_id: tableId
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
                            <div
                                key={table?.id}
                                className='grid grid-cols-[1fr,auto] gap-2 bg-background-soft p-4 border-2 rounded-lg'
                            >
                                <Link
                                    href={`${RedirectTo.FINISHED_TABLE}/${table?.id}`}
                                    className='flex-col-container gap-2'
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
                                <div>
                                    <PrintBill 
                                        finishedTableId={table?.id}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}