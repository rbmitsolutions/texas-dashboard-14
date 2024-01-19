import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export const getFirstDayOfMonth = (date: Date): Date => {
    return startOfMonth(date)
}

export const getLastDayOfMonth = (date: Date): Date => {
    return endOfMonth(date)
}

interface IFormatDate {
    date: Date,
    f?: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' | 'LLL dd, yy' | 'PPP'
}

export const formatDate = ({ date, f = 'dd/MM/yyyy' }: IFormatDate): string => {
    return format(date, f)
}

export const addDaysToDate = (date: Date, days: number): Date => {
    return addDays(date, days)
}

export const subDaysToDate = (date: Date, days: number): Date => {
    return subDays(date, days)
}