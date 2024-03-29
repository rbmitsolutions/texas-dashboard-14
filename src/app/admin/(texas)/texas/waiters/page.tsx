'use client'

//libs
import { dateFormatIso, formatDate } from '@/common/libs/date-fns/dateFormat';

//components
import SearchInput from '@/components/common/searchInput';
import LayoutFrame from '../../_components/layoutFrame';
import { Button } from '@/components/ui/button';
import Table from '../_components/table';

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useSocketIoHooks } from '@/hooks/useSocketIoHooks';
import { useAuthHooks } from '@/hooks/useAuthHooks';

//store
import { useTablesStore } from '@/store/restaurant/tables';

//interfaces
import { usePrintersStore } from '@/store/restaurant/printers';
import { useSectionsStore } from '@/store/restaurant/sections';
import { SocketIoEvent } from '@/common/libs/socketIo/types';
import { TableMealStatus } from '@/common/types/restaurant/tables.interface';
import { getTableStatusVariant } from '@/common/libs/restaurant/tables';

export default function Tables() {
    const { tablesFilter, setTablesFilter, getTablesFiltered } = useTablesStore()
    const { sections } = useSectionsStore()
    const { printers } = usePrintersStore()
    const { user } = useAuthHooks()
    const { emit } = useSocketIoHooks()

    const {
        restaurantOpenDay: openDay,
    } = useGETRestaurantDataHooks({
        query: 'OPEN_DAYS',
        defaultParams: {
            openDays: {
                byShortDay: {
                    short_day: formatDate({
                        date: new Date(),
                        f: 'ccc'
                    }),
                    date: dateFormatIso(new Date())
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        updateRestaurantData: updateTable
    } = usePUTRestaurantDataHooks({
        query: 'TABLES',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.BOOKING,
                })
                await emit({
                    event: SocketIoEvent.TABLE,
                })
            }
        }

    })

    const {
        createRestaurantData: createBooking
    } = usePOSTRestaurantDataHooks({
        query: 'BOOKINGS',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.BOOKING,
                })
                await emit({
                    event: SocketIoEvent.TABLE,
                })
            }
        }
    })

    return (
        <LayoutFrame
            user={user}
            navigation={{
                defaultPrinter: printers,
                icon: {
                    icon: 'Filter',
                    title: 'Tables'
                },
                content: (
                    <div className='flex-col-container overflow-auto'>
                        <SearchInput
                            onSearchChange={(e) => setTablesFilter({ ...tablesFilter, client_name: e })}
                            value={tablesFilter?.client_name || ''}
                            placeholder='Name'

                        />
                        <div className='grid grid-cols-3 gap-2'>
                            <Button
                                className='text-xs'
                                variant={tablesFilter?.is_open === true ? 'default' : 'outline'}
                                onClick={() => setTablesFilter({ ...tablesFilter, is_open: true })}
                            >
                                Open
                            </Button>
                            <Button
                                className='text-xs'
                                variant={tablesFilter?.is_open === false ? 'default' : 'outline'}
                                onClick={() => setTablesFilter({ ...tablesFilter, is_open: false })}
                            >
                                Close
                            </Button>
                            <Button
                                className='text-xs'
                                variant={tablesFilter?.is_open === undefined ? 'default' : 'outline'}
                                onClick={() => setTablesFilter({ ...tablesFilter, is_open: undefined })}
                            >
                                All
                            </Button>
                        </div>
                        <small className='-mb-2'>Section</small>
                        <div className='grid grid-cols-2 gap-2'>
                            {sections?.map(section => {
                                return (
                                    <Button
                                        key={section?.id}
                                        variant={tablesFilter?.section_ids?.includes(section?.id) ? 'default' : 'outline'}
                                        onClick={() => {
                                            setTablesFilter({
                                                ...tablesFilter,
                                                section_ids: tablesFilter?.section_ids?.includes(section?.id) ? tablesFilter?.section_ids?.filter(section_id => section_id !== section?.id) : [...tablesFilter?.section_ids || [], section?.id]
                                            })
                                        }}
                                        className='p-1 h-10 text-sm'
                                    >
                                        {section?.title}
                                    </Button>
                                )
                            })}
                        </div>
                        <small className='-mb-2'>Guests</small>
                        <div className='grid grid-cols-2 gap-2'>
                            {[2, 4, 6, 8]?.map(g => {
                                return (
                                    <Button
                                        key={g}
                                        className='h-12'
                                        variant={tablesFilter?.guests?.includes(g) ? 'default' : 'outline'}
                                        onClick={() => {
                                            setTablesFilter({
                                                ...tablesFilter,
                                                guests: tablesFilter?.guests?.includes(g) ? tablesFilter?.guests?.filter(guest => guest !== g) : [...tablesFilter?.guests || [], g]
                                            })
                                        }}

                                    >
                                        {g} pp
                                    </Button>
                                )
                            })}
                        </div>
                        <small className='-mb-2'>Status</small>
                        <div className='grid grid-cols-2 gap-2'>
                            {Object.values(TableMealStatus).map(status => {
                                return (
                                    <Button
                                        key={status}
                                        className='text-[10px] capitalize'
                                        variant={tablesFilter?.meal_status?.includes(status) ? getTableStatusVariant(status) : 'outline'}
                                        onClick={() => {
                                            setTablesFilter({
                                                ...tablesFilter,
                                                meal_status: tablesFilter?.meal_status?.includes(status) ? tablesFilter?.meal_status?.filter(meal_status => meal_status !== status) : [...tablesFilter?.meal_status || [], status]
                                            })
                                        }}
                                    >
                                        {status}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )
            }}

        >
            <div className='grid-container grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:grid-cols-3 xl:grid-cols-5'>
                {
                    getTablesFiltered(tablesFilter)?.map((table) => {
                        return (
                            <Table
                                key={table?.id}
                                table={table}
                                waitres={{
                                    createBooking,
                                    timesOpen: openDay?.times_open,
                                    updateTable,
                                    printers
                                }}
                            />
                        )
                    })
                }
            </div>
        </LayoutFrame>
    )
}