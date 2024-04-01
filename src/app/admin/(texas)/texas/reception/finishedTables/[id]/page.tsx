'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

//libs
import { addDaysToDate, convertMinutesToHoursAndMinutes, formatDate, subDaysToDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"

//components
import { transactionsColumnsTable } from "../../_components/transactionsColumnsTable"
import FullOrderController from "../../../_components/orderSummary/fullOrderController"
import PrintBill from "../../_components/rightReceptionDisplay/printBillButton"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import LayoutFrame from "@/app/admin/(texas)/_components/layoutFrame"
import { BasicTable } from "@/components/common/basicTable"
import Pagination from "@/components/common/pagination"
import IconText from "@/components/common/iconText"
import Wrap from "@/components/common/wrap"

//store
import { useMenuSectionsStore } from "@/store/restaurant/menuSections"
import { usePrintersStore } from "@/store/restaurant/printers"

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { TableTransactionsType } from "@/common/types/company/transactions.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { Permissions } from "@/common/types/auth/auth.interface"

export default function FinishedTable({ params }: { params: { id: string } }) {
    const { menuSections } = useMenuSectionsStore()
    const { printers } = usePrintersStore()
    const { user } = useAuthHooks()
    const { push } = useRouter()

    const {
        restaurantFinishedTable: finishedTable,
        isRestaurantDataLoading: isLoading,
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                byId: {
                    id: params?.id,
                }
            }
        },
    })

    const {
        restaurantAllOrderController: orderControllers,
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
                    finished_table_id: params?.id
                }
            }
        },
    })


    const {
        companyAllTransacations: transactions,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    type: {
                        in: [TableTransactionsType.CLOSED_TABLE]
                    },
                    payee_key: params?.id
                }
            }
        },
    })

    const {
        restaurantAllFinishedTables: finishedTables,
        GETRestaurantDataParams: finishedTablesParams,
        setGETRestaurantDataParams: setFinishedTablesParams,
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                all: {
                    date: {
                        gte: subDaysToDate(new Date(), 365),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    pagination: {
                        take: 10,
                        skip: 0
                    },
                    table_id: finishedTable?.table_id
                }
            }
        },
    })

    const {
        deleteRestaurantData: deleteFinishedTable,
        isDeleteRestaurantDataLoading: isDeleteFinishedTableLoading
    } = useDELETERestaurantDataHooks({
        query: 'FINISHED_TABLE',
        UseMutationOptions: {
            onSuccess: () => {
                push(RedirectTo.RECEPTION)
            }
        }
    })


    useEffect(() => {
        if (finishedTable?.table_id) {
            setFinishedTablesParams(prev => ({
                finishedTables: {
                    all: {
                        ...prev?.finishedTables?.all,
                        date: {
                            gte: subDaysToDate(new Date(), 365),
                            lte: addDaysToDate(new Date(), 1)
                        },
                        pagination: {
                            take: 10,
                            skip: 0
                        },
                        table_id: finishedTable?.table_id
                    }
                }
            }))
        }
    }, [finishedTable?.table_id, params.id, setFinishedTablesParams])

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
                    <div className='flex-col-container h-full overflow-auto'>
                        <div className='flex-col-container mt-2 p-4 bg-background-soft rounded-lg'>
                            <IconText
                                icon="Calendar"
                                text={
                                    formatDate({
                                        date: isLoading ? new Date() : new Date(finishedTable?.date),
                                        f: 'dd/MM/yyyy'
                                    })
                                }
                                isLoading={isLoading}
                            />
                            <IconText
                                icon="Clock1"
                                text={
                                    formatDate({
                                        date: isLoading ? new Date() : new Date(finishedTable?.start_time),
                                        f: 'HH:mm:ss',
                                        iso: false
                                    })
                                }
                                isLoading={isLoading}
                            />
                            <IconText
                                icon="Clock12"
                                text={
                                    formatDate({
                                        date: isLoading ? new Date() : new Date(finishedTable?.end_time),
                                        f: 'HH:mm:ss',
                                        iso: false
                                    })
                                }
                                isLoading={isLoading}
                            />
                            <IconText
                                icon="Clock12"
                                text={convertMinutesToHoursAndMinutes(finishedTable?.average_minutes || 1)}
                                isLoading={isLoading}
                            />
                        </div>

                        <div className='flex-col-container'>
                            <strong>Last Tables</strong>
                            <Pagination
                                onPageChange={(pagination) => setFinishedTablesParams(prev => ({
                                    finishedTables: {
                                        all: {
                                            ...prev?.finishedTables?.all,
                                            date: {
                                                gte: subDaysToDate(new Date(), 365),
                                                lte: addDaysToDate(new Date(), 1)
                                            },
                                            pagination,
                                            table_id: finishedTable?.table_id
                                        }
                                    }
                                }))}
                                queryPagination={finishedTablesParams?.finishedTables?.all?.pagination!}
                                pagination={finishedTables?.pagination}

                            />
                        </div>

                        <div className="flex-col-container gap-2 overflow-auto scrollbar-thin">
                            {finishedTables?.data?.map(table => {
                                return (
                                    <Link
                                        key={table?.id}
                                        href={`${RedirectTo.FINISHED_TABLE}/${table?.id}`}
                                        className={cn('flex-col-container gap-2 bg-background-soft p-4 border-2 rounded-lg', finishedTable?.id === table?.id && 'border-primary')}
                                    >
                                        <strong>{formatDate({
                                            date: table?.date,
                                            f: 'dd/MM/yyyy',
                                        })}</strong>
                                        <IconText
                                            icon="Users"
                                            text={table?.client}
                                        />
                                        <IconText
                                            icon="Users"
                                            text={table?.guests}
                                        />
                                        <IconText
                                            icon="Clock"
                                            text={formatDate({
                                                date: table?.start_time,
                                                f: 'HH:mm:ss',
                                                iso: false
                                            })}
                                        />
                                        <IconText
                                            icon="Clock"
                                            text={convertMinutesToHoursAndMinutes(table?.average_minutes)}
                                        />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ),
                return: {
                    path: RedirectTo.RECEPTION
                }
            }}
            rightNavigation={{
                content: (
                    <div className='flex-col-container justify-between h-full scrollbar-thin overflow-auto'>
                        <div className='flex-container justify-between items-center'>
                            {isUserAuthorized(
                                user,
                                [Permissions.ADMIN]
                            ) ?
                                <DeleteDialogButton
                                    onDelete={() => deleteFinishedTable({
                                        finishedTable: {
                                            id: finishedTable?.id
                                        }
                                    })}
                                    isDisabled={isDeleteFinishedTableLoading}
                                />
                                : <div />
                            }
                            <PrintBill
                                finishedTableId={finishedTable?.id}
                            />
                        </div>
                        <div className='flex-col-container h-full overflow-auto'>
                            {orderControllers?.data?.map(oc => {
                                return (
                                    <FullOrderController
                                        key={oc?.id}
                                        orderController={oc}
                                        orderSumary={{
                                            order: oc?.orders,
                                            menuSections,
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
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
                            icon='User'
                            text={finishedTable?.client || 'Walk In'}
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
                    <BasicTable
                        columns={transactionsColumnsTable({})}
                        data={transactions?.data || []}
                    />
                </Wrap>
            </div>
        </LayoutFrame>
    )
}