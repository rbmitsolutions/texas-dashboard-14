"use client"
import React, { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

//libs
import { formatDate, subDaysToDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"
import { Skeleton } from "@/components/ui/skeleton"
import Icon from "@/common/libs/lucida-icon"

export interface DatePickerWithRangeProps {
    className?: string
    onConfirm: (date: DateRange | undefined) => void
    fromDate?: Date
    toDate?: Date
    max?: number
    value?: DateRange
}

export function DatePickerWithRange({
    className,
    onConfirm,
    fromDate,
    toDate,
    max,
    value
}: DatePickerWithRangeProps) {
    const [preRendered, setPreRendered] = useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>(value || {
        from: subDaysToDate(new Date(), 30),
        to: new Date(formatDate({ date: new Date(), f: 'yyyy-MM-dd' }))
    })

    const handleConfirm = () => {
        onConfirm(date)
    }

    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <DatePickerWithRange.Skeleton />;
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <Icon name='Calendar' size={14} className='mr-2' />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {formatDate({
                                        date: date.from,
                                        f: "dd LLL, yy",
                                    })} -{" "}
                                    {formatDate({
                                        date: date.to,
                                        f: "dd LLL, yy",
                                    })}
                                </>
                            ) : (
                                formatDate({
                                    date: date.from,
                                    f: "dd LLL, yy",
                                })
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        fromDate={fromDate && fromDate}
                        toDate={toDate && toDate}
                        max={max && max}
                    />
                    <div className='flex justify-end gap-4'>
                        <Button
                            onClick={handleConfirm}
                            disabled={date?.from === undefined || date?.to === undefined}
                        >Confirm</Button>
                        <Button variant='destructive' size='icon'
                            onClick={() => {
                                setDate({
                                    from: fromDate || new Date(),
                                    to: toDate || new Date()
                                })
                            }}
                        >
                            <Icon name='Eraser' size={14} />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

DatePickerWithRange.Skeleton = function PaginationSkeleton() {
    return (
        <Skeleton
            className='h-8 w-full'
        />
    )
}

export interface IDatePicker {
    value: Date
    disabled?: boolean
    className?: string
    onConfirm: (date: Date | undefined) => void
    fromDate?: Date
    toDate?: Date
}

export function DatePicker({ className, fromDate, disabled = false, toDate, value, onConfirm }: IDatePicker) {
    const [preRendered, setPreRendered] = useState(false);
    const [date, setDate] = useState<Date | undefined>(value)

    const onDateChange = (date: Date | undefined) => {
        if (!date) return
        setDate(date)
        onConfirm(date)
    }

    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <DatePicker.Skeleton />;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        , className)}
                    disabled={disabled}
                >
                    <Icon name='Calendar' size={14} className='mr-2' />
                    {date ? formatDate({
                        date: date,
                        f: "dd, LLL, yy",
                    }) : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onDateChange}
                    initialFocus
                    fromDate={fromDate && fromDate}
                    toDate={toDate && toDate}
                />
            </PopoverContent>
        </Popover>
    )
}


DatePicker.Skeleton = function PaginationSkeleton() {
    return (
        <Skeleton
            className='h-8 w-full'
        />
    )
}