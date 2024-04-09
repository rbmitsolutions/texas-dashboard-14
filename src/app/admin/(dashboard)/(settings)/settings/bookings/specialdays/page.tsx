'use client'
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/common/libs/date-fns/dateFormat"

//components
import { specialDaysColumnsTable } from "./_components/specialDaysColumnsTable"
import CreateSpecialDayForm from "./_components/createSpecialDay"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

export default function Specialdays() {
    const {
        restaurantAllSpecialDays: specialDays,
        GETRestaurantDataParams: specialDaysParams,
        setGETRestaurantDataParams: setSpecialDaysParams,
        refetchRestaurantData: toRefetch
    } = useGETRestaurantDataHooks({
        query: 'SPECIAL_DAYS',
        defaultParams: {
            specialDays: {
                all: {
                    date: {
                        gte: getFirstDayOfMonth(new Date()),
                        lte: getLastDayOfMonth(new Date())
                    },
                    pagination: {
                        take: 95,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        restaurantAllSections: sections
    } = useGETRestaurantDataHooks({
        query: 'SECTIONS',
        defaultParams: {
            sections: {
                all: {
                    pagination: {
                        take: 8,
                        skip: 0
                    },
                    include: {
                        tables: {
                            guests: [2, 4, 6, 8]
                        }
                    }
                }
            }
        }
    })

    const {
        restuarantTimesOpen: timesOpen
    } = useGETRestaurantDataHooks({
        query: 'TIMES_OPEN',
        defaultParams: {
            times_open: {
                all: {
                    base: '1'
                }
            }
        }
    })

    const {
        createRestaurantData: createSpecialDay,
        isCreateRestaurantDataLoading: isLoading
    } = usePOSTRestaurantDataHooks({
        query: 'SPECIAL_DAYS',
        toRefetch
    })

    const {
        deleteRestaurantData: deleteSpecialDay
    } = useDELETERestaurantDataHooks({
        query: 'SPECIAL_DAYS',
        toRefetch
    })

    const specialDaysData = specialDays?.data || []

    return (
        <Wrap
            header={{
                title: {
                    title: 'Special Days',
                    icon: 'CalendarRange'
                }
            }}
            actions={{
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: value => setSpecialDaysParams(prev => ({
                            specialDays: {
                                all: {
                                    ...prev?.specialDays?.all,
                                    date: {
                                        gte: value?.from!,
                                        lte: value?.to!
                                    },
                                }
                            }
                        })),
                        value: {
                            from: specialDaysParams?.specialDays?.all?.date?.gte,
                            to: specialDaysParams?.specialDays?.all?.date?.lte
                        },
                        max: 90
                    }
                },
                toRight: <CreateSpecialDayForm
                    isLoading={isLoading}
                    sections={sections?.data || []}
                    createSpecialDay={createSpecialDay}
                    timesOpen={timesOpen || []}
                />,
                className: "flex justify-between gap-4"
            }}
        >
            <BasicTable
                columns={specialDaysColumnsTable({
                    deleteSpecialDay,
                })}
                data={specialDaysData}
            />
        </Wrap>
    )
}