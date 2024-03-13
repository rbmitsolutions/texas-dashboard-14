import { ITimesOpen } from "@/common/types/restaurant/config.interface";

export const getCurretBookingTime = (timesOpen: ITimesOpen[]): ITimesOpen | undefined => {
    const delepoment = process.env.NODE_ENV === 'development';

    if(delepoment) {
        return timesOpen[0]
    }

    const hours = new Date().getHours();
    let minutes = new Date().getMinutes();

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