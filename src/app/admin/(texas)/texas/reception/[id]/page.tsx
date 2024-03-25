'use client'
import { useEffect, useState } from 'react';
import { RedirectTo } from '@/common/types/routers/endPoints.types';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

//libs
import { addDaysToDate, getFirstTimeOfTheDay } from '@/common/libs/date-fns/dateFormat';
import { getWalkInClient } from '@/common/libs/restaurant/actions/walkinClients';
import { orderControllersTotal } from '@/common/libs/restaurant/orderController';
import { transactionsTotal } from '@/common/libs/company/transactions';

//components
import { transactionsColumnsTable } from '../_components/transactionsColumnsTable';
import RightReceptionDisplay from '../_components/rightReceptionDisplay';
import { TransactionsTable } from '../_components/transactionsTable';
import LayoutFrame from '../../../_components/layoutFrame';
import IconText from '@/components/common/iconText';
import Wrap from '@/components/common/wrap';

//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from '@/hooks/company/companyDataHooks';
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useSocketIoHooks } from '@/hooks/useSocketIoHooks';
import { useAuthHooks } from '@/hooks/useAuthHooks';

//store
import { useMenuSectionsStore } from '@/store/restaurant/menuSections';
import { usePrintersStore } from '@/store/restaurant/printers';
import { useTablesStore } from '@/store/restaurant/tables';

//interfaces
import { ITransactions, TableTransactionsType, TransactionsStatus } from '@/common/types/company/transactions.interface';
import { IAllOrderControllerResponse } from '@/hooks/restaurant/IGetRestaurantDataHooks.interface';
import { IGetAllTransactionsResponse } from '@/hooks/company/IGetCompanyDataHooks.interface';
import { ISocketMessage, SocketIoEvent } from '@/common/libs/socketIo/types';
import { IOrderController } from '@/common/types/restaurant/order.interface';
import { ITable } from '@/common/types/restaurant/tables.interface';

export interface IDataTable {
    table: ITable | undefined
    transactions: ITransactions[]
    orderControllers: IOrderController[]
    values: {
        total: number,
        paid: number,
    }
}

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function Table({ params }: { params: { id: string } }) {
    const { menuSections } = useMenuSectionsStore()
    const { getTableById } = useTablesStore()
    const { printers } = usePrintersStore()
    const { emit } = useSocketIoHooks()
    const { user } = useAuthHooks()
    const { push } = useRouter()
    const [dataTable, setDataTable] = useState<IDataTable>({
        table: undefined,
        transactions: [],
        orderControllers: [],
        values: {
            total: 0,
            paid: 0,
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
                    },
                    payee_key: params?.id
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const transactions = data as IGetAllTransactionsResponse
                setDataTable(prev => ({
                    ...prev,
                    transactions: transactions?.data,
                    values: {
                        ...prev?.values,
                        paid: transactionsTotal({
                            filter: {
                                payee_key: params.id,
                                status: TransactionsStatus.CONFIRMED
                            },
                            transactions: transactions?.data || []
                        })
                    }
                }))
            },
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
                    finished_table_id: null,
                    table_id: params?.id
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const orderControllers = data as IAllOrderControllerResponse

                setDataTable(prev => ({
                    ...prev,
                    orderControllers: orderControllers?.data,
                    values: {
                        ...prev?.values,
                        total: orderControllersTotal(orderControllers?.data)
                    }
                }))
            },
            enabled: !!params?.id
        }
    })

    const { createCompanyData: createTransaction } = usePOSTCompanyDataHooks({
        query: 'TRANSACTIONS',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: dataTable?.table?.id
                })

                if (dataTable?.table?.id === params?.id) {
                    await refetchTransactions()
                    await refetchOrdersController()
                } else {
                    await emit({
                        event: SocketIoEvent.ORDER,
                        message: dataTable?.table?.id
                    })
                }
            }
        }
    })

    const { updateCompanyData: updateTransaction } = usePUTCompanyDataHooks({
        query: 'TRANSACTIONS',
        UseMutationOptions: {
            onSuccess: async () => {
                if (dataTable?.table?.id === params?.id) {
                    await refetchTransactions()
                    await refetchOrdersController()
                } else {
                    await emit({
                        event: SocketIoEvent.TABLE_PAYMENT,
                        message: dataTable?.table?.id
                    })
                    await emit({
                        event: SocketIoEvent.ORDER,
                        message: dataTable?.table?.id
                    })
                }
            }
        }
    })


    const { updateRestaurantData: updateTable } = usePUTRestaurantDataHooks({
        query: 'TABLES',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.TABLE,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.BOOKING,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: dataTable?.table?.id
                })
                push(RedirectTo.RECEPTION)
            }
        }
    })

    const {
        updateRestaurantData: updateOrder
    } = usePUTRestaurantDataHooks({
        query: 'ORDER',
        UseMutationOptions: {
            onSuccess: async () => {
                if (dataTable?.table?.id === params?.id) {
                    await refetchOrdersController()
                } else {
                    await emit({
                        event: SocketIoEvent.ORDER,
                        message: params?.id
                    })
                }
            }
        }
    })

    const handleCloseTable = async () => {
        let client = {
            id: dataTable?.table?.client_id,
            name: dataTable?.table?.client_name
        }

        if (!client.id && !client.name) {
            const walkIn = await getWalkInClient()

            client = {
                id: walkIn?.id,
                name: walkIn?.name
            }
        }

        await updateTable({
            table: {
                id: params.id,
                close_table: {
                    client_id: client?.id!,
                    client_name: client?.name!
                }
            }
        })
    }

    useEffect(() => {
        setDataTable(prev => ({
            ...prev,
            table: getTableById(params.id)
        }))
    }, [getTableById, params.id])

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
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
    }, [params?.id, refetchOrdersController, refetchTransactions]);

    useEffect(() => {
        const table = getTableById(params?.id)
        if (!table || !table?.is_open) {
            push(RedirectTo.RECEPTION)
        }
    }, [getTableById, params?.id, push])


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
                        <i>Some info</i>
                    </div>
                ),
                return: {
                    path: RedirectTo.RECEPTION
                }
            }}
            rightNavigation={{
                content: (
                    <RightReceptionDisplay
                        dataTable={dataTable}
                        menuSections={menuSections || []}
                        createTransaction={createTransaction}
                        user={user}
                        updateOrder={updateOrder}
                        printers={printers || []}
                        closeTable={handleCloseTable}
                    />
                ),
                icon: {
                    title: 'Order',
                    icon: 'ShoppingCart'
                }
            }}
        >
            <div className='grid grid-rows-2 gap-4 h-full'>
                <div className='grid grid-rows-[1fr,auto] h-full'>
                    <div className='flex-col-container justify-center items-center p-4 rounded-xl w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover ' />
                    <div className='p-2 space-y-2'>
                        <IconText
                            icon='LifeBuoy'
                            text={`Table: ${dataTable?.table?.number}`}
                        />
                        <IconText
                            icon='User'
                            text={dataTable?.table?.client_name || 'Walk In'}
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
                    className='p-4 rounded-xl bg-background-soft overflow-auto scrollbar-thin'
                >
                    <TransactionsTable
                        columns={transactionsColumnsTable({
                            updateTransaction,
                        })}
                        data={dataTable?.transactions || []}
                    />
                </Wrap>
            </div>
        </LayoutFrame>
    )
}