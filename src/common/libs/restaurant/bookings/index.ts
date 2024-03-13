import { IBookingStatus, IBookings } from "@/common/types/restaurant/bookings.interface";
import { IGETBookingsPageReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";

export const getBookingAmountPerTable = (amount_of_people: number): number => {
    if (amount_of_people <= 2) {
        return 2;
    } else if (amount_of_people <= 5) {
        return 4;
    } else if (amount_of_people <= 6) {
        return 6;
    } else {
        return 8;
    }
}


export const BOOKING_PEOPLE = [
    {
        id: 1,
        label: "1",
        amount_per_table: 2
    },
    {
        id: 2,
        label: "2",
        amount_per_table: 2
    },
    {
        id: 3,
        label: "3",
        amount_per_table: 4
    },
    {
        id: 4,
        label: "4",
        amount_per_table: 4
    },
    {
        id: 5,
        label: "5",
        amount_per_table: 4
    },
    {
        id: 6,
        label: "6",
        amount_per_table: 6
    },
    {
        id: 7,
        label: "7",
        amount_per_table: 6
    },
    {
        id: 8,
        label: "8",
        amount_per_table: 6
    },
];

export const BOOKING_PEOPLE_AUTH = [
    {
        id: 1,
        label: "1",
        amount_per_table: 2
    },
    {
        id: 2,
        label: "2",
        amount_per_table: 2
    },
    {
        id: 3,
        label: "3",
        amount_per_table: 4
    },
    {
        id: 4,
        label: "4",
        amount_per_table: 4
    },
    {
        id: 5,
        label: "5",
        amount_per_table: 4
    },
    {
        id: 6,
        label: "6",
        amount_per_table: 6
    },
    {
        id: 7,
        label: "7",
        amount_per_table: 6
    },
    {
        id: 8,
        label: "8",
        amount_per_table: 6
    },
    {
        id: 9,
        label: "9",
        amount_per_table: 6
    },
    {
        id: 10,
        label: "10",
        amount_per_table: 6
    },
    {
        id: 11,
        label: "11",
        amount_per_table: 6
    },
    {
        id: 12,
        label: "12",
        amount_per_table: 6
    },
    {
        id: 13,
        label: "13",
        amount_per_table: 6
    },
    {
        id: 14,
        label: "14",
        amount_per_table: 6
    },
    {
        id: 15,
        label: "15",
        amount_per_table: 6
    },
    {
        id: 16,
        label: "16",
        amount_per_table: 6
    },
    {
        id: 17,
        label: "17",
        amount_per_table: 6
    },
    {
        id: 18,
        label: "18",
        amount_per_table: 6
    },
    {
        id: 19,
        label: "19",
        amount_per_table: 6
    },
    {
        id: 20,
        label: "20",
        amount_per_table: 6
    },
    {
        id: 21,
        label: "21",
        amount_per_table: 6
    },
    {
        id: 22,
        label: "22",
        amount_per_table: 6
    },
    {
        id: 23,
        label: "23",
        amount_per_table: 6
    },
    {
        id: 24,
        label: "24",
        amount_per_table: 6
    },
    {
        id: 25,
        label: "25",
        amount_per_table: 6
    },
];

interface IBOOKING_STATUS {
    title: string;
    status: IBookingStatus
    changeStatus: boolean;
    bg: string;
}

export const BOOKING_STATUS: IBOOKING_STATUS[] = [
    {
        title: "Confirmed",
        status: "confirmed",
        changeStatus: false,
        bg: 'bg-green-200 dark:bg-green-900',
    },
    {
        title: "Unconfirmed",
        status: "unconfirmed",
        changeStatus: false,
        bg: 'bg-red-200 dark:bg-red-900',
    },
    {
        title: "Not Shown",
        status: "not_shown",
        changeStatus: true,
        bg: 'bg-blue-200 dark:bg-blue-900',
    },
    {
        title: "Canceled",
        status: "canceled",
        changeStatus: true,
        bg: 'bg-amber-200 dark:bg-amber-800',
    },
    {
        title: "Walk In",
        status: "walk_in",
        changeStatus: true,
        bg: 'bg-pink-200 dark:bg-pink-900',
    },
    {
        title: "Arrived",
        status: "arrived",
        changeStatus: true,
        bg: 'bg-purple-200 dark:bg-purple-900',
    },
];


export const bookingBackgroundColor = (
    status: IBookingStatus,
) => {
    const bookingStatus = BOOKING_STATUS.find((item) => item.status === status);
    return bookingStatus?.bg
}

export interface IBookingPageFilter {
    name?: string;
    contact_number?: string;
    status?: IBookingStatus[];
    orderBy?: 'amount_of_people/asc' | 'amount_of_people/desc' | 'status/asc' | 'status/desc';
    time?: string
    amount_per_table?: number
}

type ValidSortKey = keyof IGETBookingsPageReturn;

export const bookingPagefilter = (data: IBookingPageFilter, bookings: IBookings[]): IBookings[] => {
    let filteredBookings = bookings;

    if (data?.name ) {
        filteredBookings = filteredBookings?.filter(booking =>
            booking?.client?.name.toLowerCase().includes(data?.name!.toLowerCase())
        );
    }

    if (data?.contact_number) {
        filteredBookings = filteredBookings?.filter(booking =>
            booking?.client?.contact_number.includes(data?.contact_number!)
        );
    }

    if (data?.status && data?.status?.length > 0) {
        filteredBookings = filteredBookings?.filter(booking =>
            data.status?.includes(booking.status)
        );
    }

    if (data?.amount_per_table) {
        filteredBookings = filteredBookings?.filter(booking =>
            booking.amount_of_people === data.amount_per_table
        );
    }

    if(data?.time) {
        filteredBookings = filteredBookings?.filter(booking =>
            booking.time === data.time
        );
    }

    if (data?.orderBy) {
        const [sortKey, sortOrder] = data.orderBy.split('/') as [ValidSortKey, 'asc' | 'desc'];
        const key = sortKey as keyof IBookings;
        const order = sortOrder as 'asc' | 'desc';
        if (key && order) {
            filteredBookings?.sort((a, b) => {
                if (order === 'asc') {
                    return a[key]! > b[key]! ? 1 : -1;
                } else {
                    return a[key]! < b[key]! ? 1 : -1;
                }
            });
        }
    }

    return filteredBookings;
}


export const DEFAULT_TIMES_OPEN = [
    {
        id: 1,
        open: "12:00",
        close: "13:30",
        title: "12:00PM TO 13:30PM",
    },
];

const incrementTime = (time: string, minutes: number) => {
    const [hours, minutesPart] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutesPart + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;
};

const endTime = "23:30";

let currentTime = DEFAULT_TIMES_OPEN[0].open;
while (currentTime !== endTime) {
    currentTime = incrementTime(currentTime, 30);
    const newEntry = {
        id: DEFAULT_TIMES_OPEN.length + 1,
        open: currentTime,
        close: incrementTime(currentTime, 90),
        title: `${currentTime}PM TO ${incrementTime(currentTime, 90)}PM`,
    };
    DEFAULT_TIMES_OPEN.push(newEntry);
}


