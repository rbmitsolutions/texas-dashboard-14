import InfoBox from "@/components/common/infoBox"
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useCallback, useEffect } from "react"

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

    const {
        restaurantFinishedTableAnalytics: finishedTablesCount,
        setGETRestaurantDataParams: setFinishedTablesCount
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
    }, [setFinishedTablesCount
    ]);
    
    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='grid grid-cols-4 gap-4'>
            {finishedTablesCount?.sort((a: ITablesServedData, b: ITablesServedData) => {
                return a.guests - b.guests
            })?.map((data: ITablesServedData) => {
                return (
                    <InfoBox
                        key={data?.guests}
                        icon={{
                            name: 'Dice4',
                        }}
                        title={data?.guests + ' Guests'}
                        value={data?._count?._all || 0}
                    />
                )
            })}
        </div>
    )
}