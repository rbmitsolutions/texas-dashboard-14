'use client'
import { useAuthHooks } from "@/hooks/useAuthHooks";
import LayoutFrame from "../../../_components/layoutFrame";
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

export default function Chefs() {
    const { user } = useAuthHooks()

    const {
        restaurantAllTables: tables,
        refetchRestaurantData: refetchTables
    } = useGETRestaurantDataHooks({
        query: 'TABLES',
        defaultParams: {
            tables: {
                all: {
                    is_open: true,
                    pagination: {
                        take: 400,
                        skip: 0
                    },
                    orderBy: {
                        key: 'food_ordered_at',
                        order: 'asc'
                    }
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

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
            <div className='flex flex-col gap-4 md:flex-row md:max-w-[calc(100vw_-_240px)] md:overflow-auto md:scrollbar-thin'>
                {tables?.data?.map(table => {
                    return (
                        <div
                            key={table?.id}
                            className='p-4 bg-orange-500'
                        >
                            <strong>{table?.number}</strong>
                        </div>
                    )
                })}
            </div>
        </LayoutFrame>
    )
}