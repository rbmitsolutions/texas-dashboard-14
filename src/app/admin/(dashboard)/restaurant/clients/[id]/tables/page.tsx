'use client'

//libs
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/common/libs/date-fns/dateFormat"

//components

import { finishedTablesColumnsTable } from "@/components/common/basicTable/columns/restaurant/finishedTablesColumnsTable"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IQueryPagination } from "@/common/types/settings.interface"


export default function ClientTables({ params }: { params: { id: string } }): JSX.Element {

    const {
        restaurantAllFinishedTables: finishedTables,
        setGETRestaurantDataParams: setFinishedTables,
        GETRestaurantDataParams: finishedTablesParams,
        isRestaurantDataFetching: isFinishedTablesFetching,
        isRestaurantDataLoading: isFinishedTablesLoading,
        restaurantDataError: error
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        keepParmas: true,
        defaultParams: {
            finishedTables: {
                all: {
                    date: {
                        gte: getFirstDayOfMonth(new Date()),
                        lte: getLastDayOfMonth(new Date())
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    include: {
                        finished_orders: '1'
                    },
                    client_id: params?.id
                }
            }
        }
    })

    return (
        <Wrap
            header={{
                title: {
                    title: 'Finished Tables',
                    icon: 'Table2'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setFinishedTables(prev => ({
                        finishedTables: {
                            all: {
                                ...prev?.finishedTables?.all,
                                date: {
                                    gte: prev?.finishedTables?.all?.date.gte!,
                                    lte: prev?.finishedTables?.all?.date.lte!
                                },
                                pagination
                            }
                        }
                    })),
                    pagination: finishedTables?.pagination,
                    queryPagination: finishedTablesParams?.finishedTables?.all?.pagination!,
                    isFetching: isFinishedTablesFetching
                },
            }}
            actions={{
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (date) => setFinishedTables(prev => ({
                            finishedTables: {
                                all: {
                                    ...prev?.finishedTables?.all,
                                    date: {
                                        gte: new Date(date?.from!),
                                        lte: new Date(date?.to!),
                                    },
                                    pagination: {
                                        take: 20,
                                        skip: 0
                                    }
                                }
                            }
                        })),
                        max: 180,
                        value: {
                            from: finishedTablesParams?.finishedTables?.all?.date.gte!,
                            to: finishedTablesParams?.finishedTables?.all?.date.lte!
                        }
                    }
                },
                className: 'flex'
            }}
            isLoading={isFinishedTablesLoading}
            error={error}
        >
            <BasicTable
                columns={finishedTablesColumnsTable({})}
                data={finishedTables?.data}
            />
        </Wrap>
    )
}