import { ITimesOpen } from "@/common/types/restaurant/config.interface";

export const findCurrentTimeSlot = (array: ITimesOpen[]): ITimesOpen => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeString = `${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

    for (let i = 0; i < array.length; i++) {
        const slot = array[i];
        const openTime = slot.open;
        const closeTime = slot.close;

        if (currentTimeString < array[array.length - 1].open) {
            return array[array.length - 1];
        }

        if (currentTimeString > array[0].open) {
            return array[0];
        }

        if (currentTimeString >= openTime && currentTimeString <= closeTime) {
            return slot;
        }
    }

    return array[0];
}

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
