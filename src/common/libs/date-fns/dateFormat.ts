import { isToday as isTodayFns, format, addDays, subDays, startOfMonth, endOfMonth, startOfDay, endOfDay, startOfWeek, parse, parseISO, addMinutes, isWithinInterval, isBefore, formatISO, eachDayOfInterval } from "date-fns";

export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const dateFormatIso = (date: Date): Date => {
    return new Date(formatISO(new Date(date), { representation: 'date' }) + "T00:00:00.000Z")
}

export const parseDate = (date: string, format: 'dd/MM/yy' | 'h:mma'): Date => {
    return parse(date, format, new Date())
}

export const isWithinIntervalDate = (date: Date, interval: { start: Date, end: Date }): boolean => {
    return isWithinInterval(dateFormatIso(date), interval)
}

export const getMondayOfTheWeek = (date: Date): Date => {
    return addDays(startOfWeek(dateFormatIso(date)), 1)
}

export const getSundayOfTheWeek = (date: Date): Date => {
    return addDays(startOfWeek(dateFormatIso(date)), 7)
}

export const getFistDayOfTheWeek = (date: Date): Date => {
    return startOfWeek(dateFormatIso(date))
}

export const getLastDayOfTheWeek = (date: Date): Date => {
    return addDays(startOfWeek(dateFormatIso(date)), 6)
}

export const getFirstDayOfMonth = (date: Date): Date => {
    return startOfMonth(dateFormatIso(date))
}

export const getLastDayOfMonth = (date: Date): Date => {
    return endOfMonth(dateFormatIso(date))
}

export const getEachDayOfInterval = (start: Date, end: Date): Date[] => {
    return eachDayOfInterval({ start: dateFormatIso(start), end: dateFormatIso(end) })
}

interface IFormatDate {
    date: Date,
    f?: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' | 'LLL dd, yy' | 'PPP' | 'dd, LLL, yy' | 'yyyy-MM-dd' | 'dd LLL, yy' | 'HH:mm:ss' | 'HH:mm' | 'ccc' | 'h:mma' | 'LLL dd, yy HH:mm' | 'dd/MM/yy' | 'EEE' | 'yyy'
    iso?: boolean
}

export const formatDate = ({ date, f = 'dd/MM/yyyy', iso = true }: IFormatDate): string => {
    return format(iso ? dateFormatIso(date) : date, f)
}

export const convertMinutesToHoursAndMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hoursString = hours > 0 ? `${hours}h` : '';
    const minutesString = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
    return `${hoursString} ${minutesString}`
}


export const addDaysToDate = (date: Date, days: number): Date => {
    return addDays(dateFormatIso(date), days)
}

export const addMinutesToDate = (date: Date, minutes: number): Date => {
    return addMinutes(dateFormatIso(date), minutes)
}

export const subDaysToDate = (date: Date, days: number): Date => {
    return subDays(dateFormatIso(date), days)
}

export const getFirstTimeOfTheDay = (date: Date): Date => {
    return startOfDay(dateFormatIso(date))
}

export const getLastTimeOfTheDay = (date: Date): Date => {
    return endOfDay(dateFormatIso(date))
}

export const isToday = (date: Date): boolean => {
    return isTodayFns(dateFormatIso(date));
}

export const parseISODate = (date: string): Date => {
    return parseISO(date)
}

export const isDateBeforeDate = (dateA: Date, dateB: Date): boolean => {
    return isBefore(dateFormatIso(dateA), dateFormatIso(dateB))
}

export const compareAscDate = (dateA: Date, dateB: Date): number => {
    return dateFormatIso(dateA).getTime() - dateFormatIso(dateB).getTime()
}

export const getMonth = (number: number): string => {
    switch (number) {
        case 0:
            return 'Jan'
        case 1:
            return 'Febr'
        case 2:
            return 'Mar'
        case 3:
            return 'Apr'
        case 4:
            return 'May'
        case 5:
            return 'Jun'
        case 6:
            return 'Jul'
        case 7:
            return 'Aug'
        case 8:
            return 'Sep'
        case 9:
            return 'Oct'
        case 10:
            return 'Nov'
        case 11:
            return 'Dec'
        default:
            return ''
    }
}

export const convertIfValueIsDate = (value: string) => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateTimeRegex.test(value)) {
        return formatDate({
            date: new Date(value),
            f: 'dd/MM/yyyy HH:mm'
        })
    } else if (dateRegex.test(value)) {
        return formatDate({
            date: new Date(value)
        })
    }

    return value
}