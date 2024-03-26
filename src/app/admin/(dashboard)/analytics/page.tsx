'use client'

//libs
import { dateFormatIso, getMondayOfTheWeek, getSundayOfTheWeek } from "@/common/libs/date-fns/dateFormat"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import DirectionAnalytics from "./_components/directionAnalytics"
import InfoBox from "@/components/common/infoBox"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interface
import { TransactionsDirection, TransactionsStatus } from "@/common/types/company/transactions.interface"
import { DatePickerWithRange } from "@/components/common/datePicker"
import { DateRange } from "react-day-picker"
import { useState } from "react"



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
                from: dateFormatIso(from!),
                to: dateFormatIso(to!)
            })
        }
    }

    return (
        <div className='flex-col-container'>
            <div className='flex-container justify-between py-4'>
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
            <DirectionAnalytics date={date} />
        </div>
    )
}