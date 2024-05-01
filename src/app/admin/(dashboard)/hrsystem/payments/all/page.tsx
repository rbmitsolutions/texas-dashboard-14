'use client'

//libs
import { formatDate, getFistDayOfTheWeek, getLastDayOfTheWeek } from "@/common/libs/date-fns/dateFormat";

//components
import { TransactionsColumnsTable } from "../../employees/all/[id]/_components/transactionsColumnsTable";
import { BasicTable } from "@/components/common/basicTable";
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";
import Icon from "@/common/libs/lucida-icon";
import Wrap from "@/components/common/wrap";

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interface
import { GiftCardPaymentsType, PayrollTransactionsType, TableTransactionsType, TransactionsDirection, TransactionsMethod } from "@/common/types/company/transactions.interface";

export default function AllPaymentsPage() {

    const {
        companyAllTransacations: transactions,
        GETCompanyDataParams: transactionsParams,
        setGETCompanyDataParams: setTransactionsParams,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        keepParmas: true,
        defaultParams: {
            transactions: {
                all: {
                    pagination: {
                        take: 40,
                        skip: 0
                    },
                    created_at: {
                        gte: new Date(formatDate({
                            date: new Date(getFistDayOfTheWeek(new Date())),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(
                            formatDate({
                                date: new Date(getLastDayOfTheWeek(new Date())),
                                f: 'yyyy-MM-dd'
                            })
                        )
                    }
                }
            }
        }
    })

    const onOptionsChange = (type: 'transactionType' | 'transactionMethod' | 'transactionDirection', value: string) => {
        setTransactionsParams(prev => ({
            transactions: {
                all: {
                    ...prev?.transactions?.all,
                    type: {
                        in: type === 'transactionType' ? value === 'all' ? [] : [value as any] : prev?.transactions?.all?.type?.in || []
                    },
                    method: {
                        in: type === 'transactionMethod' ? value === 'all' ? [] : [value as any] : prev?.transactions?.all?.method?.in || []
                    },
                    direction: {
                        in: type === 'transactionDirection' ? value === 'all' ? [] : [value as any] : prev?.transactions?.all?.direction?.in || []
                    },
                    pagination: {
                        take: 40,
                        skip: 0
                    }
                }
            }
        }))
    }

    const allTransactionsType = [
        ...Object.values(TableTransactionsType),
        ...Object.values(GiftCardPaymentsType),
        ...Object.values(PayrollTransactionsType)
    ].map((type) => ({
        value: type,
        label: type
    }))

    const allTransactionsMethod = Object.values(TransactionsMethod).map((method) => ({
        value: method,
        label: method
    }))

    const allTransactionsDirection = Object.values(TransactionsDirection).map((direction) => ({
        value: direction,
        label: direction
    }))

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Euro',
                    title: 'Payments'
                },
                pagination: {
                    onPageChange: (page) => {
                        setTransactionsParams(prev => ({
                            transactions: {
                                all: {
                                    ...prev?.transactions?.all,
                                    pagination: page,
                                }
                            }
                        }))
                    },
                    pagination: transactions?.pagination,
                    queryPagination: transactionsParams?.transactions?.all?.pagination!
                }
            }}
            actions={{
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (data) => setTransactionsParams(prev => ({
                            transactions: {
                                all: {
                                    ...prev?.transactions?.all,
                                    created_at: {
                                        gte: new Date(formatDate({
                                            date: new Date(data?.from!),
                                            f: 'yyyy-MM-dd'
                                        })),
                                        lte: new Date(
                                            formatDate({
                                                date: new Date(data?.to!),
                                                f: 'yyyy-MM-dd'
                                            })
                                        )
                                    },
                                    pagination: {
                                        take: 40,
                                        skip: 0
                                    }
                                }
                            }
                        })),
                        max: 30,
                        value: {
                            from: transactionsParams?.transactions?.all?.created_at?.gte!,
                            to: transactionsParams?.transactions?.all?.created_at?.lte!
                        }
                    },
                },
                searchInput: {
                    onSearchChange: (value) => setTransactionsParams(prev => ({
                        transactions: {
                            all: {
                                ...prev?.transactions?.all,
                                valid_by: value,
                                pagination: {
                                    take: 40,
                                    skip: 0
                                }
                            }
                        }
                    })),
                    value: transactionsParams?.transactions?.all?.valid_by || '',
                    placeholder: 'Search by Valid By'
                },
                optionsPopover: {
                    options: [
                        {
                            label: 'Transaction Type',
                            value: transactionsParams?.transactions?.all?.type?.in && transactionsParams?.transactions?.all?.type?.in[0] || '',
                            placeholder: 'Transaction Type',
                            onChange: (e: string) => onOptionsChange('transactionType', e),
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...allTransactionsType
                            ]
                        },
                        {
                            label: 'Transaction method',
                            value: transactionsParams?.transactions?.all?.method?.in && transactionsParams?.transactions?.all?.method?.in[0] || '',
                            placeholder: 'Transaction method',
                            onChange: (e: string) => onOptionsChange('transactionMethod', e),
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...allTransactionsMethod
                            ]
                        },
                        {
                            label: 'Transaction Direction',
                            value: transactionsParams?.transactions?.all?.direction?.in && transactionsParams?.transactions?.all?.direction?.in[0] || '',
                            placeholder: 'Transaction Direction',
                            onChange: (e: string) => onOptionsChange('transactionDirection', e),
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...allTransactionsDirection
                            ]
                        }
                    ]
                },
                toLeft: (
                    <SearchInput
                        onSearchChange={(value) => setTransactionsParams(prev => ({
                            transactions: {
                                all: {
                                    ...prev?.transactions?.all,
                                    payee: value,
                                    pagination: {
                                        take: 40,
                                        skip: 0
                                    }
                                }
                            }
                        }))}
                        value={transactionsParams?.transactions?.all?.payee || ''}
                        placeholder="Search by Payee"
                    />
                ),
                toRight: (
                    <Button
                        size='iconExSm'
                        onClick={() => setTransactionsParams(prev => ({
                            transactions: {
                                all: {
                                    ...prev?.transactions?.all,
                                    payee: '',
                                    valid_by: '',
                                    created_at: {
                                        gte: new Date(formatDate({
                                            date: new Date(getFistDayOfTheWeek(new Date())),
                                            f: 'yyyy-MM-dd'
                                        })),
                                        lte: new Date(
                                            formatDate({
                                                date: new Date(getLastDayOfTheWeek(new Date())),
                                                f: 'yyyy-MM-dd'
                                            })
                                        )
                                    },
                                    method: {
                                        in: []
                                    },
                                    type: {
                                        in: []
                                    },
                                    direction: {
                                        in: []
                                    },
                                    pagination: {
                                        take: 40,
                                        skip: 0
                                    }
                                }
                            }
                        }))}
                    >
                        <Icon
                            name='Eraser'
                        />
                    </Button>
                ),
                className: 'grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr,1fr,auto,auto,auto]'
            }}
            className="bg-background-soft p-4 rounded-lg"
        >
            <BasicTable
                columns={TransactionsColumnsTable({
                })}
                data={transactions?.data || []}
            />
        </Wrap >
    )
}