import { convertMinutesToHoursAndMinutes } from "@/common/libs/date-fns/dateFormat"
import InfoBox from "@/components/common/infoBox"
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useCallback, useEffect } from "react"

interface AvgTableTimeAnalyticsProps {
    date: { from: Date, to: Date }
}

interface IAvgTableTimeData {
    guests: number
    _avg: {
        average_minutes: number
    }
}

export default function AvgTableTimeAnalytics({ date }: AvgTableTimeAnalyticsProps) {

    const {
        restaurantFinishedTableAnalytics: finishedTablesAvgTime,
        setGETRestaurantDataParams: setFinishedTablesAvgTime
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                analytics: {
                    avg: {
                        by: ['guests'],
                    },
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }
    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setFinishedTablesAvgTime(({
            finishedTables: {
                analytics: {
                    avg: {
                        by: ['guests'],
                    },
                    date: {
                        gte: date.from,
                        lte: date.to
                    },
                }
            }
        }))
    }, [setFinishedTablesAvgTime]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='grid grid-cols-4 gap-4'>
            {finishedTablesAvgTime?.sort((a: IAvgTableTimeData, b: IAvgTableTimeData) => {
                return a.guests - b.guests
            })?.map((data: IAvgTableTimeData) => {
                return (
                    <InfoBox
                        key={data?.guests}
                        icon={{
                            name: 'Dice4',
                        }}
                        title={data?.guests + ' Guests'}
                        value={convertMinutesToHoursAndMinutes(Number(data?._avg?.average_minutes?.toFixed(0))) || 0}
                    />
                )
            })}
        </div>
    )
}