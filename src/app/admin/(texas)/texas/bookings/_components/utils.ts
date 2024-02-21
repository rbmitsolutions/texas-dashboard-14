import { IGETBookingPageTimesOpenReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";

export const findCurrentTimeSlot = (array: IGETBookingPageTimesOpenReturn[]) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeString = `${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

    for (let i = 0; i < array.length; i++) {
        const slot = array[i];
        const openTime = slot.open;
        const closeTime = slot.close;

        if (currentTimeString >= openTime && currentTimeString <= closeTime) {
            return slot;
        }
    }

    return null;
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
