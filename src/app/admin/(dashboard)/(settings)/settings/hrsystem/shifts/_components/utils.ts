import { addMinutesToDate, formatDate } from "@/common/libs/date-fns/dateFormat";
import { ShiftFormSchemaType } from "@/common/libs/zod/forms/company/companyShiftForm";
import { IShifts } from "@/common/types/company/companyDetails.interface";


const convertTimeToDate = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes);
}


export const calculateMinTime = ({
    from,
    breakTime
}: {
    from: string
    breakTime: string
}) => {
    const breakValue = parseInt(breakTime, 10) || 0;
    if (!from) return '';
    const fromDate = convertTimeToDate(from);
    const toDate = addMinutesToDate(fromDate, breakValue);
    return formatDate({
        date: toDate,
        f: 'HH:mm'
    });
}

interface IShiftFormatReturn {
    title: string,
    hours: number,
    break_minutes: number,
}

export const shiftFormat = (data: ShiftFormSchemaType): IShiftFormatReturn => {
    const fromDate = convertTimeToDate(data?.from);
    const toDate = convertTimeToDate(data?.to);
    const hoursInMinutes = (toDate.getTime() - fromDate.getTime()) / 1000 / 60;

    return {
        title: data?.from + ' to ' + data?.to,
        hours: hoursInMinutes - data?.break,
        break_minutes: data?.break,
    }
}
