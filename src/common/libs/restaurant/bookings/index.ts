import { IBookingStatus, IBookings } from "@/common/types/restaurant/bookings.interface";

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