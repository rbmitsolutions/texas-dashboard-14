'use client'
import { io } from 'socket.io-client';
import { useEffect } from 'react';

//libs
import { addDaysToDate, getFirstTimeOfTheDay } from '@/common/libs/date-fns/dateFormat';

//components
import { transactionsColumnsTable } from '../_components/transactionsColumnsTable';
import RightReceptionDisplay from '../_components/rightReceptionDisplay';
import { TransactionsTable } from '../_components/transactionsTable';
import LayoutFrame from '../../../_components/layoutFrame';
import IconText from '@/components/common/iconText';
import Wrap from '@/components/common/wrap';

//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from '@/hooks/company/companyDataHooks';
import { useGETRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useSocketIoHooks } from '@/hooks/useSocketIoHooks';
import { useAuthHooks } from '@/hooks/useAuthHooks';

//store
import { useOrderSystemOrderControllerStore } from '@/store/texas/orderController';
import { useTransactionsStore } from '@/store/company/transactions';
import { useOrderTablesNewOrderStore } from '@/store/texas/order';
import { useOrderSystemTablesStore } from '@/store/texas/tables';

//interfaces
import { IAllOrderControllerResponse, IGETTablesAllResponse } from '@/hooks/restaurant/IGetRestaurantDataHooks.interface';
import { IGetAllTransactionsResponse } from '@/hooks/company/IGetCompanyDataHooks.interface';
import { TableTransactionsType, TransactionsStatus } from '@/common/types/company/transactions.interface';
import { ISocketMessage, SocketIoEvent } from '@/common/libs/socketIo/types';
import { ITable } from '@/common/types/restaurant/tables.interface';

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function Table({ params }: { params: { id: string } }) {
    const { getFilteredOrderControllers, getTotalOfOrdersByTableId } = useOrderSystemOrderControllerStore()
    const { getTransactionsByFilter, getTransactionsTotalByFilter, setTransactions, transactions } = useTransactionsStore()
    const { setOrderControllers } = useOrderSystemOrderControllerStore()
    const { getOneOrderTotal } = useOrderTablesNewOrderStore()
    const { getTableById, tables, setTables } = useOrderSystemTablesStore()
    const { user } = useAuthHooks()
    const { emit } = useSocketIoHooks()

    const table = getTableById(params.id)
    const tableTransactions = getTransactionsByFilter({ payee_key: params.id })
    const orderControllers = getFilteredOrderControllers({ table_id: params.id })

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
                const transactions = data as IGetAllTransactionsResponse
                setTransactions(transactions?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        refetchRestaurantData: refetchOrdersController,
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
        restaurantAllMenuSections: sections
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
        restaurantGiftCard: giftCard,
        setGETRestaurantDataParams: setGiftCardParams,
        GETRestaurantDataParams: getGiftCardParams
    } = useGETRestaurantDataHooks({
        query: 'GIFTCARD',
        defaultParams: {
            giftcards: {
                byCode: {
                    code: ''
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const { createCompanyData: createTransaction } = usePOSTCompanyDataHooks({
        query: 'TRANSACTIONS'
    })

    const { updateCompanyData: updateTransaction } = usePUTCompanyDataHooks({
        query: 'TRANSACTIONS'
    })
    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            // if (message?.event === SocketIoEvent.ORDER && message?.message === params?.id) {
            //     refetchOrdersController()
            // }
            if (message?.event === SocketIoEvent.TABLE_PAYMENT && message?.message === params?.id) {
                refetchTransactions()
            }
        });
        () => {
            socket.off("message");
        }
    }, [params?.id, refetchTransactions]);

    useEffect(() => {
        if (tables?.length === 0) {
            refetchTables()
        }

        if (transactions?.length === 0) {
            refetchTransactions()
        }

        if (orderControllers?.length === 0) {
            refetchOrdersController()
        }
    }, [orderControllers?.length, refetchOrdersController, refetchTables, refetchTransactions, tables?.length, transactions?.length])

    return (
        <LayoutFrame
            user={user}
            navigation={{
                content: (
                    <div className='flex-col-container overflow-auto'>


                    </div>
                ),
                return: {
                    path: '/admin/texas/reception',
                }
            }}
            rightNavigation={{
                content: (
                    <RightReceptionDisplay
                        orderController={orderControllers || []}
                        table={table || {} as ITable}
                        getOneOrderTotal={getOneOrderTotal}
                        sections={sections?.data || []}
                        values={{
                            total: getTotalOfOrdersByTableId(params.id),
                            paid: getTransactionsTotalByFilter({
                                payee_key: params.id,
                                status: TransactionsStatus.CONFIRMED
                            }),
                            remaining: getTotalOfOrdersByTableId(params.id) - getTransactionsTotalByFilter({
                                payee_key: params.id,
                                status: TransactionsStatus.CONFIRMED
                            })
                        }}
                        giftCard={{
                            card: giftCard,
                            setCardParams: setGiftCardParams,
                            getCardParams: getGiftCardParams
                        }}
                        createTransaction={createTransaction}
                        emit={emit}
                        user={user}
                    />
                ),
                icon: <div />,
                title: 'Table Transactions',
            }}
        >
            <div className='grid grid-rows-2 gap-4 h-full'>
                <div className='grid grid-rows-[1fr,auto] h-full'>
                    <div className='flex-col-container justify-center items-center p-4 rounded-xl w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover ' />
                    <div className='p-2 space-y-2'>
                        <IconText
                            icon='LifeBuoy'
                            text={`Table: ${table?.number}`}
                        />
                        <IconText
                            icon='User'
                            text={table?.client_name || 'Walk In'}
                        />
                    </div>
                </div>
                <Wrap
                    header={{
                        title: {
                            icon: 'ArrowRightLeft',
                            title: 'Transactions'
                        }
                    }}
                    className='p-4 rounded-xl bg-background-soft overflow-auto'
                >
                    <TransactionsTable
                        columns={transactionsColumnsTable({
                            updateTransaction,
                            emit
                        })}
                        data={tableTransactions || []}
                    />
                </Wrap>
            </div>
        </LayoutFrame>
    )
}