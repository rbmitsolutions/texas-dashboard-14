import { useCallback, useEffect, useState } from "react"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import { finishedTablesColumnsTable } from "@/components/common/basicTable/columns/restaurant/finishedTablesColumnsTable"
import { BasicTable } from "@/components/common/basicTable"
import InfoBox from "@/components/common/infoBox"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

interface TablesServedAnalyticsProps {
    date: { from: Date, to: Date }
}

interface ITablesServedData {
    guests: number
    _count: {
        _all: number
    }
}

export default function TablesServedAnalytics({ date }: TablesServedAnalyticsProps) {

    const [guests, setGuests] = useState<number | undefined>(undefined)
    const {
        restaurantFinishedTableAnalytics: finishedTablesCount,
        setGETRestaurantDataParams: setFinishedTablesCount,
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                analytics: {
                    by: ['guests'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }
    })


    const {
        restaurantAllFinishedTables: finishedTables,
        setGETRestaurantDataParams: setFinishedTables,
        GETRestaurantDataParams: finishedTablesParams,
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                all: {
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    include: {
                        finished_orders: '1'
                    },
                    guests: undefined
                }
            }
        },
        UseQueryOptions: {
            enabled: !!guests
        }
    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setFinishedTablesCount(({
            finishedTables: {
                analytics: {
                    by: ['guests'],
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }))

        if (guests)
            setFinishedTables(({
                finishedTables: {
                    all: {
                        date: {
                            gte: date.from,
                            lte: date.to
                        },
                        pagination: {
                            take: 20,
                            skip: 0
                        },
                        include: {
                            finished_orders: '1'
                        },
                        guests: String(guests)
                    }
                }
            }))
    }, [setFinishedTablesCount, setFinishedTables, guests]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='flex-col-container gap-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
                {finishedTablesCount?.sort((a: ITablesServedData, b: ITablesServedData) => {
                    return a.guests - b.guests
                })?.map((data: ITablesServedData) => {
                    return (
                        <div
                            key={data?.guests}
                            className={cn('border-2 rounded-2xl cursor-pointer w-full', guests === data?.guests ? 'border-primary' : 'border-transparent')}
                            onClick={() => setGuests(guests === data?.guests ? undefined : data?.guests)}
                        >
                            <InfoBox

                                icon={{
                                    name: 'Dice4',
                                }}
                                title={data?.guests + ' Guests'}
                                value={data?._count?._all || 0}
                            />
                        </div>
                    )
                })}
            </div>
            {guests &&
                <Wrap
                    header={{
                        title: {
                            title: 'Transactions',
                            icon: 'PiggyBank'
                        },
                        pagination: {
                            onPageChange: (pagination) => setFinishedTables(prev => ({
                                finishedTables: {
                                    all: {
                                        ...prev?.finishedTables?.all,
                                        date: {
                                            gte: date.from,
                                            lte: date.to
                                        },
                                        pagination: pagination
                                    }
                                }
                            })),
                            pagination: finishedTables?.pagination,
                            queryPagination: finishedTablesParams?.finishedTables?.all?.pagination!,
                        }
                    }}
                >
                    <BasicTable
                        columns={finishedTablesColumnsTable({})}
                        data={finishedTables?.data || []}
                    />
                </Wrap>}
        </div>
    )
}