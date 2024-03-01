import { isToday as isTodayFns, format, addDays, subDays, startOfMonth, endOfMonth, startOfDay, endOfDay, startOfWeek, parse, formatDuration, parseISO, addMinutes, isWithinInterval, isBefore } from "date-fns";

export const parseDate = (date: string, format: 'dd/MM/yy' | 'h:mma'): Date => {
    return parse(date, format, new Date())
}

export const isWithinIntervalDate = (date: Date, interval: { start: Date, end: Date }): boolean => {
    return isWithinInterval(date, interval)
}

export const getMondayOfTheWeek = (date: Date): Date => {
    return addDays(startOfWeek(date), 1)
}

export const getSundayOfTheWeek = (date: Date): Date => {
    return addDays(startOfWeek(date), 7)
}

export const getFistDayOfTheWeek = (date: Date): Date => {
    return startOfWeek(date)
}

export const getLastDayOfTheWeek = (date: Date): Date => {
    return addDays(startOfWeek(date), 6)
}

export const getFirstDayOfMonth = (date: Date): Date => {
    return startOfMonth(date)
}

export const getLastDayOfMonth = (date: Date): Date => {
    return endOfMonth(date)
}

interface IFormatDate {
    date: Date,
    f?: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' | 'LLL dd, yy' | 'PPP' | 'dd, LLL, yy' | 'yyyy-MM-dd' | 'dd LLL, yy' | 'HH:mm:ss' | 'HH:mm' | 'ccc' | 'h:mma' | 'LLL dd, yy HH:mm' 
}

export const formatDate = ({ date, f = 'dd/MM/yyyy' }: IFormatDate): string => {
    return format(date, f)
}

export const convertMinutesToHoursAndMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hoursString = hours > 0 ? `${hours}h` : '';
    const minutesString = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
    return `${hoursString} ${minutesString}`
}


export const addDaysToDate = (date: Date, days: number): Date => {
    return addDays(date, days)
}

export const addMinutesToDate = (date: Date, minutes: number): Date => {
    return addMinutes(date, minutes)
}

export const subDaysToDate = (date: Date, days: number): Date => {
    return subDays(date, days)
}

export const getFirstTimeOfTheDay = (date: Date): Date => {
    return startOfDay(date)
}

export const getLastTimeOfTheDay = (date: Date): Date => {
    return endOfDay(date)
}

export const isToday = (date: Date): boolean => {
    return isTodayFns(date);
}

export const parseISODate = (date: string): Date => {
    return parseISO(date)
}

export const isDateBeforeDate = (dateA: Date, dateB: Date): boolean => {
    return isBefore(dateA, dateB)
}

export const compareAscDate = (dateA: Date, dateB: Date): number => {
    return dateA.getTime() - dateB.getTime()
}