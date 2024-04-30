//libs
import { formatDate, getFistDayOfTheWeek } from "@/common/libs/date-fns/dateFormat";

//components
import { TransactionsColumnsTable } from "@/app/admin/(dashboard)/hrsystem/employees/all/[id]/_components/transactionsColumnsTable";
import CreatePaymentToUser from "./_components/createPaymentToUser";
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";

//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IUser } from "@/common/types/user/user.interface";

interface PaymentsAnalyticsProps {
    user: IUser
    isAdmin: boolean
}

export default function PaymentsAnalytics({ user, isAdmin }: PaymentsAnalyticsProps) {
    const {
        companyAllTransacations: transactions,
        setGETCompanyDataParams,
        GETCompanyDataParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    payee_key: user?.id,
                    date: {
                        gte: new Date(formatDate({
                            date: getFistDayOfTheWeek(new Date()),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: new Date(),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                    pagination: {
                        take: 5,
                        skip: 0
                    },
                    orderBy: {
                        key: 'date',
                        order: 'desc'
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!user?.id
        }
    })

    const {
        createCompanyData: createTransaction,
    } = usePOSTCompanyDataHooks({
        query: 'TRANSACTIONS',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Euro',
                    title: 'Payments'
                },
                pagination: {
                    onPageChange: (page) => {
                        setGETCompanyDataParams(prev => ({
                            transactions: {
                                all: {
                                    ...prev?.transactions?.all,
                                    pagination: page,
                                    date: {
                                        gte: new Date(formatDate({
                                            date: new Date(prev?.transactions?.all?.date?.gte!),
                                            f: 'yyyy-MM-dd'
                                        })),
                                        lte: new Date(
                                            formatDate({
                                                date: new Date(prev?.transactions?.all?.date?.lte!),
                                                f: 'yyyy-MM-dd'
                                            })
                                        )
                                    }
                                }
                            }
                        }))
                    },
                    pagination: transactions?.pagination,
                    queryPagination: GETCompanyDataParams?.transactions?.all?.pagination!
                }
            }}


            actions={{
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (data) => setGETCompanyDataParams(prev => ({
                            transactions: {
                                all: {
                                    ...prev?.transactions?.all,
                                    user_id: user?.id,
                                    date: {
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
                                    }
                                }
                            }
                        })),
                        max: 30,
                        value: {
                            from: GETCompanyDataParams?.transactions?.all?.date?.gte!,
                            to: GETCompanyDataParams?.transactions?.all?.date?.lte!
                        }
                    },
                },
                toRight: (
                    isAdmin && <CreatePaymentToUser user={user} createTransaction={createTransaction} />
                ),
                className: 'flex-container justify-between'
            }}
            className="bg-background-soft p-4 rounded-lg"
        >
            <BasicTable
                columns={TransactionsColumnsTable({
                })}
                data={transactions?.data || []}
            />
        </Wrap>
    )
}