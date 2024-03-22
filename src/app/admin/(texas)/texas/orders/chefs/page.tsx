'use client'
import { useState } from "react";

//libs
import { getTableStatusVariant } from "@/common/libs/restaurant/tables";

//components
import LayoutFrame from "../../../_components/layoutFrame";
import { Button } from "@/components/ui/button";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";

//sotre
import { useTablesStore } from "@/store/restaurant/tables";

//interface
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface";
import { formatDate } from "@/common/libs/date-fns/dateFormat";

export default function Chefs() {
    const { getTablesFiltered } = useTablesStore()
    const [number, setNumber] = useState<string>('')
    const { user } = useAuthHooks()

    const tables = getTablesFiltered({
        is_open: true,
        meal_status: [TableMealStatus.MAIN, TableMealStatus.ALL_TOGETHER]
    })

    // const soonerTableOrdered = tables?.find

    const getTableWithLowestFoodOrderedAt = (tables: ITable[]): ITable | undefined => {
        if (tables.length === 0) {
            return undefined;
        }

        // Sort tables by food_ordered_at in ascending order
        tables.sort((a, b) => new Date(a.food_ordered_at)?.getTime() - new Date( b.food_ordered_at)?.getTime());

        // Return the first table with the lowest food_ordered_at value
        return tables[0];
    }

    console.log(getTableWithLowestFoodOrderedAt(tables || []))

    return (
        <LayoutFrame
            user={user}
            navigation={{
                icon: {
                    icon: 'Filter',
                    title: 'Tables'
                },
                content: (
                    <div />
                )
            }}
        >
            <div className='grid grid-rows-[1fr,auto] gap-4 h-full max-h-screen'>
                <div className='grid grid-cols-2 h-full overflow-scroll scrollbar-thin'>
                    <div className='bg-green-900 rounded-lg'>
                        {tables[0] ?
                            <div
                                key={tables[0]?.id}
                                className='flex-col-container justify-center items-center h-full p-4 rounded-lg'
                            >
                                <strong className='text-[200px] text-white'>{tables[0]?.number}</strong>
                            </div>
                            :
                            <div className='flex-col-container justify-center items-center h-full p-4 rounded-lg bg-background-soft'>
                                <strong className='text-3xl'>No tables</strong>
                            </div>
                        }
                    </div>
                    <div className='grid grid-cols-3 gap-4 p-4 overflow-scroll scrollbar-thin'>
                        {tables?.slice(1)?.map(table => {
                            return (
                                <div
                                    key={table?.id}
                                    className='flex-col-container justify-center items-center p-4 rounded-lg bg-background-soft'
                                >
                                    <strong className='text-3xl'>{table?.number}</strong>
                                    <Button
                                        className='capitalize'
                                        variant={getTableStatusVariant(table?.meal_status)}
                                    >
                                        {table?.meal_status}
                                    </Button>
                                    <strong>
                                        {formatDate({
                                            date: table?.food_ordered_at,
                                            f: 'HH:mm:ss',
                                            iso: false
                                        })}
                                    </strong>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-[1fr,auto] gap-4 h-60">
                    <div className='grid grid-cols-5 grid-rows-2 gap-2'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]?.map(n => {
                            return (
                                <Button
                                    key={n}
                                    className='h-full w-full text-3xl'
                                    onClick={() => number.length < 2 && setNumber(number + n)}
                                >
                                    {n}
                                </Button>
                            )
                        })}
                    </div>
                    <div className='grid grid-rows-2 gap-4 w-60'>
                        <div className='flex-container justify-center items-center bg-background-soft'>
                            <strong className='text-5xl'>
                                {number}
                            </strong>
                        </div>
                        <div className="grid grid-cols-[1fr,100px] gap-4 items-center">
                            <Button
                                className='h-full text-2xl'
                            >
                                OK
                            </Button>
                            <Button
                                className='h-full text-2xl'
                                onClick={() => setNumber('')}
                                variant='destructive'
                            >
                                C
                            </Button>
                        </div>


                    </div>
                </div>
            </div>
        </LayoutFrame>
    )
}