'use client'

//components
import { timesOpenColumnsTable } from "./_components/timesOpenColumnsTable"
import { TimesOpenTable } from "./_components/timesOpenTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimesOpen() {

    const {
        restaurantAllOpenDays: daysOpen,
    } = useGETRestaurantDataHooks({
        query: 'OPEN_DAYS',
        defaultParams: {
            openDays: {
                all: {
                    pagination: {
                        take: 10,
                        skip: 0
                    }
                }
            }
        }
    })

    const sortedDays = daysOpen?.data?.sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    }) || []

    return (
        <Wrap
            header={{
                title: {
                    title: 'Times Open',
                    icon: 'Clock'
                }
            }}
        >
            <TimesOpenTable
                columns={timesOpenColumnsTable({})}
                data={sortedDays}
            />
        </Wrap>
    )
}