'use client'
import { useState } from "react"
import { endOfDay } from "date-fns"

//libs
import { formatDate, getLastTimeOfTheDay, getMondayOfTheWeek } from "@/common/libs/date-fns/dateFormat"

//components
import TransactionsAnalytics from "./_components/transactionsAnalytics"
import BookingsAnalytics from "./_components/bookingsAnalytics"
import SalesAnalytics from "./_components/salesAnalytics"
import OwtAnalytics from "./_components/owtAnalytics"

//interface
import { DatePickerWithRange } from "@/components/common/datePicker"
import { DateRange } from "react-day-picker"

export default function Analytics() {
    const [date, setDate] = useState<{
        from: Date
        to: Date
    }>({
        from: new Date(formatDate({
            date: getMondayOfTheWeek(new Date()),
            f: 'yyyy-MM-dd',
        })),
        to: getLastTimeOfTheDay(new Date()),
    })

    const onDateChange = (date: DateRange | undefined) => {
        if (date) {
            const { from, to } = date
            setDate({
                from: new Date(formatDate({
                    date: new Date(from!),
                    f: 'yyyy-MM-dd',
                })),
                to: getLastTimeOfTheDay(new Date(to!)),
            })
        }
    }

    return (
        <div className='flex-col-container gap-8'>
            <div className='flex-container justify-between'>
                <h1 className='text-2xl font-bold'>Analytics</h1>
                <DatePickerWithRange
                    onConfirm={onDateChange}
                    max={365}
                    value={{
                        from: date?.from,
                        to: date?.to
                    }}
                    toDate={new Date()}
                />
            </div>
            <BookingsAnalytics date={date} />
            <TransactionsAnalytics date={date} />
            <SalesAnalytics date={date} />
            <OwtAnalytics date={date} />
        </div>
    )
}