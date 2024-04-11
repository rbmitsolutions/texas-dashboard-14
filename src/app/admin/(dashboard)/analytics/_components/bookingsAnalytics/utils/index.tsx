import { BOOKING_STATUS } from "@/common/libs/restaurant/bookings"
import { IBookingStatus } from "@/common/types/restaurant/bookings.interface"



export interface IDataBooking {
    _count: {
        _all: number
    },
    status: IBookingStatus
    amount_of_people: number
}

export interface IDataBookingTime {
    _count: {
        _all: number
    },
    time: string
    amount_of_people: number
}

export interface IDataBookingGuets {
    _count: {
        _all: number
    },
    amount_of_people: string
}

export interface ITransformBookingTimeReturn {
    name: string,
    time: string,
    bookings: number,
    guests: number
}

export const transformBookingTimeData = (bookingData: IDataBookingTime[]): ITransformBookingTimeReturn[] => {
    const result: ITransformBookingTimeReturn[] = [];

    const uniqueTimesMap = new Map();

    bookingData?.forEach(booking => {
        const { time, _count, amount_of_people } = booking;

        if (!uniqueTimesMap.has(time)) {
            uniqueTimesMap.set(time, {
                name: time,
                title: time,
                bookings: _count._all,
                guests: _count._all * amount_of_people
            });
        } else {
            const existingTime = uniqueTimesMap.get(time);
            existingTime.bookings += _count._all;
            existingTime.guests += _count._all * amount_of_people;
        }
    });

    uniqueTimesMap.forEach(value => {
        result.push(value);
    });

    return result;
}

export interface ITransformBookingReturn {
    name: IBookingStatus,
    fill: string
    bookings: number,
    guests: number
}


export const transformBookingData = (bookingData: IDataBooking[]): ITransformBookingTimeReturn[] => {
    const result: ITransformBookingTimeReturn[] = [];

    const uniqueTimesMap = new Map();

    bookingData?.forEach(booking => {
        const { _count, amount_of_people, status } = booking

        if (!uniqueTimesMap.has(status)) {
            uniqueTimesMap.set(status, {
                name: status,
                fill: BOOKING_STATUS?.find(s => status === s.status)?.hex,
                bookings: _count._all,
                guests: _count._all * amount_of_people
            })
        } else {
            const existingTime = uniqueTimesMap.get(status);
            existingTime.bookings += _count._all;
            existingTime.guests += _count._all * amount_of_people;
        }

    })

    uniqueTimesMap.forEach(value => {
        result.push(value);
    });

    return result
}