'use client'
//components
import { sectionsColumnsTable } from "./_components/sectionsColumnsTable"
import { SectionsTable } from "./_components/sectionsTable"
import AddSection from "./_components/addSection"
import Icon from "@/common/libs/lucida-icon"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

export default function Sections() {
    const {
        restaurantAllSections: sections,
        refetchRestaurantData: restaurantSections,
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
        refetchRestaurantData: restaurantOpenDays,
    } = useGETRestaurantDataHooks({
        query: 'OPEN_DAYS',
        defaultParams: {
            openDays: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                }
            }
        }
    })

    const toRefetch = () => {
        restaurantSections()
        restaurantOpenDays()
    }

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
                    const allTblesOpenPerDay = sections?.data?.map(section => {
                        const isOpen = section?.days_open?.find(day => day?.day === d?.day)
                        let tablesCount: { [key: number]: number } = {
                            2: 0,
                            4: 0,
                            6: 0,
                            8: 0
                        }

                        if (isOpen) {
                            section?.tables?.forEach(t => {
                                tablesCount[t?.guests] = tablesCount[t?.guests] + 1
                            })
                        }

                        return tablesCount
                    })

                    const totalTables = allTblesOpenPerDay.reduce((a, b) => {
                        return {
                            2: a[2] + b[2],
                            4: a[4] + b[4],
                            6: a[6] + b[6],
                            8: a[8] + b[8]
                        }
                    }, {
                        2: 0,
                        4: 0,
                        6: 0,
                        8: 0
                    })


                    return (
                        <div key={d?.id} className='flex flex-col gap-1 bg-background-soft p-4 rounded-xl'>
                            <strong className='text-primary text-sm'>{d?.day}</strong>
                            {Object.keys(totalTables).map(g => {
                                return (
                                    <div key={g} className='flex items-center gap-4'>
                                        <div className='flex items-center gap-2'>
                                            <Icon name='Dice4' className='text-primary' />
                                            <small>Tbs {g}: {totalTables[g as any]}</small>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Icon name='Armchair' className='text-primary' />
                                            <small>{totalTables[g as any] * parseInt(g)} Sts</small>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className='mt-1'>
                                <strong className='text-primary text-sm'>Total</strong>
                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <Icon name='Dice4' className='text-primary' />
                                        <small>Tbs: {Object.values(totalTables).reduce((a, b) => {
                                            return Number(a) + Number(b)
                                        }, 0)}
                                        </small>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Icon name='Armchair' className='text-primary' />
                                        <small>Sts: {Object.keys(totalTables).reduce((a, b) => {
                                            return Number(a) + totalTables[b as any] * parseInt(b)
                                        }, 0)}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
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