import { ITimesOpen } from "@/common/types/restaurant/config.interface";

export const getCurretBookingTime = (timesOpen: ITimesOpen[]): ITimesOpen | undefined => {
    return timesOpen[0]
    const hours =  new Date().getHours();
    let minutes =  new Date().getMinutes();

    if (minutes < 30) {
        minutes = 0;
    } else {
        minutes = 30;
    }

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formated = `${formattedHours}:${formattedMinutes}`

    const currentTime = timesOpen?.find(t => t.open === formated)

    return currentTime;
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
