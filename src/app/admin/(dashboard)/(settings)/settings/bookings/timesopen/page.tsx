'use client'

import CreateTimeOpenForm from "./_components/createTimesOpen"
//components
import { timesOpenColumnsTable } from "./_components/timesOpenColumnsTable"
import { TimesOpenTable } from "./_components/timesOpenTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimesOpen() {
    const {
        restaurantAllOpenDays: daysOpen,
        refetchRestaurantData: toRefetch
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

    const {
        createRestaurantData: createTimesOpen,
        isCreateRestaurantDataLoading: isLoading
    } = usePOSTRestaurantDataHooks({
        query: 'TIMES_OPEN',
        toRefetch
    })

    const {
        updateRestaurantData: updateTimesOpen
    } = usePUTRestaurantDataHooks({
        query: 'TIMES_OPEN',
        toRefetch
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
            actions={{
                toRight: <CreateTimeOpenForm
                    openDays={sortedDays}
                    isLoading={isLoading}
                    createTimesOpen={createTimesOpen}
                />,
                className: 'flex justify-end'
            }}
        >
            <TimesOpenTable
                columns={timesOpenColumnsTable({
                    updateTimesOpen
                })}
                data={sortedDays}
            />
        </Wrap>
    )
}