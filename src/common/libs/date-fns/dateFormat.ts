import { isToday as isTodayFns, format, addDays, subDays, startOfMonth, endOfMonth, startOfDay, endOfDay, startOfWeek, parse, formatDuration } from "date-fns";

export const parseDate = (date: string, format: 'dd/MM/yy'): Date => {
    return parse(date, format, new Date())
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
    f?: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' | 'LLL dd, yy' | 'PPP' | 'dd, LLL, yy' | 'yyyy-MM-dd' | 'dd LLL, yy' | 'HH:mm:ss'
}

export const formatDate = ({ date, f = 'dd/MM/yyyy' }: IFormatDate): string => {
    return format(date, f)
}

export const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return format(new Date(0, 0, 0, hours, remainingMinutes), 'HH:mm');
}


export const addDaysToDate = (date: Date, days: number): Date => {
    return addDays(date, days)
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
