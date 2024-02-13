'use client'

//components
import AddSection from "./_components/addSection"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { SectionsTable } from "./_components/sectionsTable"
import { sectionsColumnsTable } from "./_components/sectionsColumnsTable"
import InfoBox from "@/components/common/infoBox"

export default function Sections() {
    const {
        restaurantAllSections: sections,
        refetchRestaurantData: toRefetch,
    } = useGETRestaurantDataHooks({
        query: 'SECTIONS',
        defaultParams: {
            sections: {
                all: {
                    include: {
                        tables: "1",
                        days_open: "1",
                        special_days: "1"
                    },
                    pagination: {
                        take: 50,
                        skip: 0
                    },
                    orderBy: {
                        key: 'priority',
                        order: 'asc'
                    }
                }
            }
        }
    })

    const {
        restaurantAllOpenDays: daysOpen,
    } = useGETRestaurantDataHooks({
        query: 'OPEN_DAYS',
        defaultParams: {
            openDays: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        createRestaurantData: createSection,
    } = usePOSTRestaurantDataHooks({
        query: 'SECTIONS',
        toRefetch
    })
    const {
        createRestaurantData: addTable,
    } = usePOSTRestaurantDataHooks({
        query: 'TABLES',
        toRefetch
    })

    const {
        deleteRestaurantData: deleteSection,
    } = useDELETERestaurantDataHooks({
        query: 'SECTIONS',
        toRefetch
    })

    const {
        deleteRestaurantData: deleteTable,
    } = useDELETERestaurantDataHooks({
        query: 'TABLES',
        toRefetch
    })

    const {
        updateRestaurantData: editSection,
    } = usePUTRestaurantDataHooks({
        query: 'SECTIONS',
        toRefetch
    })

    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className='flex-col-container gap-8'>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
                {daysOpen?.data?.sort((a, b) => {
                    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
                }).map(d => {
                    return (
                        <InfoBox
                            key={d?.id}
                            title={d?.day}
                            icon={{
                                name: 'Calendar',
                                size: 18
                            }}
                            value={8}
                        />
                    )
                })}
            </div>
            <Wrap
                header={{
                    title: {
                        title: 'Sections',
                        icon: 'SquareStack'
                    }
                }}
                actions={{
                    toLeft: (
                        <div className='flex items-center gap-4'>
                            <AddSection
                                addSection={createSection}
                            />
                            <small className='text-foreground/40'>
                                <i>
                                    The higher the priority, the bookings will be directed to it first!</i>
                            </small>
                        </div >
                    )
                }}
            >
                <SectionsTable
                    columns={sectionsColumnsTable({
                        addTable,
                        deleteTable,
                        deleteSection,
                        editSection,
                        daysOpen: daysOpen?.data || []
                    })}
                    data={sections?.data || []}
                />
            </Wrap>
        </div>
    )
}