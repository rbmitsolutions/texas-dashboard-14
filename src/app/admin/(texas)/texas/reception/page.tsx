'use client'
import { io } from 'socket.io-client';
import { useEffect } from 'react';

//libs
import { addDaysToDate, getFirstTimeOfTheDay } from '@/common/libs/date-fns/dateFormat';

//components
import SearchInput from '@/components/common/searchInput';
import LayoutFrame from '../../_components/layoutFrame';
import ClosedTables from './_components/closedTables';
import BuyGiftCard from './_components/buyGiftCard';
import { Button } from '@/components/ui/button';
import Table from '../_components/table';

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useAuthHooks } from '@/hooks/useAuthHooks';

//store
import { useOrderControllerStore } from '@/store/restaurant/orderController';
import { useTransactionsStore } from '@/store/company/transactions';
import { useTablesStore } from '@/store/restaurant/tables';

//interfaces
import { IAllOrderControllerResponse, IGETTablesAllResponse } from '@/hooks/restaurant/IGetRestaurantDataHooks.interface';
import { IGetAllTransactionsResponse } from '@/hooks/company/IGetCompanyDataHooks.interface';
import { TableTransactionsType } from '@/common/types/company/transactions.interface';
import { ISocketMessage, SocketIoEvent } from '@/common/libs/socketIo/types';
import { useGETCompanyDataHooks } from '@/hooks/company/companyDataHooks';

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function Reception() {
    const { tablesFilter, setTablesFilter, setTables, getTablesFiltered } = useTablesStore()
    const { setOrderControllers, getTotalOfOrdersByTableId } = useOrderControllerStore()
    const { getTransactionsTotalByFilter, setTransactions } = useTransactionsStore()
    const { user } = useAuthHooks()

    const {
        refetchRestaurantData: refetchTables
    } = useGETRestaurantDataHooks({
        query: 'TABLES',
        defaultParams: {
            tables: {
                all: {
                    pagination: {
                        take: 400,
                        skip: 0
                    },
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const tables = data as IGETTablesAllResponse
                setTables(tables?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        restaurantAllSections: sections,
    } = useGETRestaurantDataHooks({
        query: 'SECTIONS',
        defaultParams: {
            sections: {
                all: {
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
        refetchCompanyData: refetchTransactions
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    type: {
                        in: [TableTransactionsType.OPEN_TABLE]
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                // ba1e31be-bb72-4c4e-bd5a-0b7e1ba180f8
                const transactions = data as IGetAllTransactionsResponse
                setTransactions(transactions?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })


    const {
        refetchRestaurantData: refetchOrdersController
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    includes: {
                        orders: '1'
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    finished_table_id: null
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const orderControllers = data as IAllOrderControllerResponse
                setOrderControllers(orderControllers?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        restaurantAllClients: clients,
        GETRestaurantDataParams: GETClientsParams,
        setGETRestaurantDataParams: setGETClientsParams
    } = useGETRestaurantDataHooks({
        query: 'CLIENTS',
        defaultParams: {
            clients: {
                all: {
                    contact_number: '',
                    pagination: {
                        take: 1,
                        skip: 0
                    }
                }
            }
        },
    })

    const {
        createRestaurantData: createGiftCard
    } = usePOSTRestaurantDataHooks({
        query: 'GIFTCARD'
    })

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (message?.event === SocketIoEvent.TABLE) {
                refetchTables()
            }
            if (message?.event === SocketIoEvent.ORDER) {
                refetchOrdersController()
            }
            if (message?.event === SocketIoEvent.TABLE_PAYMENT) {
                refetchTransactions()
            }
        });
        () => {
            socket.off("message");
        }
    }, [refetchTables, refetchOrdersController, refetchTransactions]);


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
                        <div className='grid grid-cols-2 gap-2'>
                            <BuyGiftCard
                                clients={clients?.data}
                                setClientsParams={setGETClientsParams}
                                clientsParams={GETClientsParams}
                                createGiftCard={createGiftCard}
                            />
                            <ClosedTables />
                        </div>
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
                            {sections?.data?.map(section => {
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
            <div className='grid-container grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,222px))]'>
                {
                    getTablesFiltered(tablesFilter)?.map((table) => {
                        return (
                            <Table
                                key={table?.id}
                                table={table}
                                reception={{
                                    getTotalOfOrdersByTableId,
                                    getTransactionsTotalByFilter
                                }}
                            />
                        )
                    })
                }
            </div>
        </LayoutFrame>
    )
}