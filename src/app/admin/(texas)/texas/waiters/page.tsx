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
import { useOrderControllerStore } from '@/store/restaurant/orderController';
import { useOrderStore } from '@/store/restaurant/order';

//interfaces
import { OrderStatus } from '@/common/types/restaurant/order.interface';
import { SocketIoEvent } from '@/common/libs/socketIo/types';
import { usePrintersStore } from '@/store/restaurant/printers';
import { useSectionsStore } from '@/store/restaurant/sections';

export default function Tables() {
    const { tablesFilter, setTablesFilter, getTablesFiltered } = useTablesStore()
    const { getOrderControllers, } = useOrderControllerStore()
    const { sections } = useSectionsStore()
    const { getOneOrderTotal } = useOrderStore()
    const { printers } = usePrintersStore()
    const { user } = useAuthHooks()
    const { emit } = useSocketIoHooks()

    const {
        restaurantAllMenuSections: menuSections
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    includes: {
                        types: '1'
                    },
                    pagination: {
                        take: 200,
                        skip: 0
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

    const {
        updateRestaurantData: updateOrder
    } = usePUTRestaurantDataHooks({
        query: 'ORDER',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.ORDER
                })
                await emit({
                    event: SocketIoEvent.TABLE
                })
            }
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
                    <div className='flex-col-container overflow-auto'>
                        <SearchInput
                            onSearchChange={(e) => setTablesFilter({ ...tablesFilter, client_name: e })}
                            value={tablesFilter?.client_name || ''}
                            placeholder='Name'

                        />
                        <small className='-mb-2'>Status</small>
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
                    </div>
                )
            }}

        >
            <div className='grid-container grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:grid-cols-4 xl:grid-cols-6'>
                {
                    getTablesFiltered(tablesFilter)?.map((table) => {
                        return (
                            <Table
                                key={table?.id}
                                table={table}
                                waitres={{
                                    createBooking,
                                    timesOpen: openDay?.times_open,
                                    orderControllers: getOrderControllers({
                                        table_id: table?.id,
                                        orders: {
                                            status: [OrderStatus.ORDERED]
                                        }
                                    }),
                                    getOneOrderTotal,
                                    menuSections: menuSections?.data,
                                    updateOrder,
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