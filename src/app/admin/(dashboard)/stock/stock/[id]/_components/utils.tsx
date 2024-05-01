import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { IStockItem } from "@/common/types/restaurant/stock.interface"

export interface ILastOrderPrice {
    created_at: Date
    _sum: {
        one_volume_price: number
    }
}

interface ITransformLastOrderPriceReturn {
    name: string,
    total: number
}

const generateDateRange = (from: Date, to: Date): string[] => {
    let currentDate = new Date(from);
    const toDate = new Date(to);
    const datesArray = [];

    while (currentDate <= toDate) {
        datesArray.push(formatDate({
            date: new Date(currentDate),
            f: 'dd/MM/yy'
        }));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
}

export const transformLastOrderPriceData = (date: {
    from: Date
    to: Date
}, data: ILastOrderPrice[], item: IStockItem): ITransformLastOrderPriceReturn[] => {
    const datesArray = generateDateRange(date.from, date.to)

    const uniquedDateValuesMap = new Map();

    data?.forEach(order => {
        const { created_at, _sum } = order;

        const date = formatDate({
            date: new Date(created_at),
            f: 'dd/MM/yy'
        })

        if (!uniquedDateValuesMap.has(date)) {
            uniquedDateValuesMap.set(date, {
                name: date,
                total: Number(((_sum.one_volume_price * item?.volume) / 100).toFixed(2))
            });
        } else {
            const existingDate = uniquedDateValuesMap.get(date);
            if (existingDate.one_volume_price < _sum.one_volume_price) {
                existingDate.one_volume_price = Number(((_sum.one_volume_price * item?.volume) / 100).toFixed(2))
            }
        }
    });

    const result: ITransformLastOrderPriceReturn[] = [];

    datesArray.forEach(date => {
        if (uniquedDateValuesMap.has(date)) {
            result.push(uniquedDateValuesMap.get(date))
        } else {
            result.push({
                name: date,
                total: 0
            })
        }
    });

    return result
}