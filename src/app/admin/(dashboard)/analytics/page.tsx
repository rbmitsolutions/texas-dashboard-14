'use client'
import { useState } from "react"

//libs
import { dateFormatIso, getFirstTimeOfTheDay, getLastTimeOfTheDay, getMondayOfTheWeek, getSundayOfTheWeek } from "@/common/libs/date-fns/dateFormat"

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
        from: getMondayOfTheWeek(new Date()),
        to: getSundayOfTheWeek(new Date())
    })

    const onDateChange = (date: DateRange | undefined) => {
        if (date) {
            const { from, to } = date
            setDate({
                from: getFirstTimeOfTheDay(dateFormatIso(from!)),
                to: getLastTimeOfTheDay(dateFormatIso(to!))
            })
        }
    }

    return (
        <div className='flex-col-container gap-8'>
            <div className='flex-container justify-between'>
                <h1 className='text-2xl font-bold'>Analytics</h1>
                <DatePickerWithRange
                    onConfirm={onDateChange}
                    max={90}
                    value={{
                        from: date?.from,
                        to: date?.to
                    }}
                />
            </div>
            <BookingsAnalytics date={date} />
            <TransactionsAnalytics date={date} />
            <SalesAnalytics date={date} />
            <OwtAnalytics date={date} />
            <strong>Haccp Reports</strong>
        </div>
    )
}