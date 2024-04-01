'use client'
import { useEffect, useState } from "react";

//components
import { RosterPaymentTable } from "./table/rosterPaymentTable";
import RosterPaymentHeader from "./rosterPaymentHeader";
import Wrap from "@/components/common/wrap";

//libs
import { formatDate, getMondayOfTheWeek, getSundayOfTheWeek } from "@/common/libs/date-fns/dateFormat";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";

//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interfaces
import { PayrollTransactionsType, TransactionsDirection, TransactionsMethod } from "@/common/types/company/transactions.interface";
import { IPOSTTransaction, IPOSTTransactionsBody } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IUserExtraPaymentData } from "@/hooks/company/IGetCompanyDataHooks.interface";
import { IDepartments } from "@/common/types/company/departaments.interface";
import { useDebounce } from "@/common/utils/useDebouce";

export interface ICreateTransaction {
    value: number,
    user: IUserExtraPaymentData,
    type: PayrollTransactionsType
}


interface RosterPaymentsPageComponentsProps {
    departments: IDepartments[]
}

export default function RosterPaymentsPageComponents({ departments }: RosterPaymentsPageComponentsProps): JSX.Element {
    const { user } = useAuthHooks()
    const [transaction, setTransaction] = useState<IPOSTTransaction[]>([])

    const {
        companyRosterPaymentPage: users,
        setGETCompanyDataParams: setUsersParams,
        GETCompanyDataParams: usersParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'ROSTER',
        defaultParams: {
            roster: {
                rosterPayment: {
                    date: {
                        gte: new Date(formatDate({
                            date: getMondayOfTheWeek(new Date()),
                            f: 'yyyy-MM-dd'
                        })),
                        lte: new Date(formatDate({
                            date: getSundayOfTheWeek(new Date()),
                            f: 'yyyy-MM-dd'
                        }))
                    },
                    name: '',
                    status: 'Working'
                }
            }
        }
    })

    const {
        createCompanyData: createTransactions,
        isCreateCompanyDataLoading: isCreateTransactionsLoading
    } = usePOSTCompanyDataHooks({
        query: 'TRANSACTIONS',
        toRefetch
    })

    const {
        updateCompanyData: updateRoster,
    } = usePUTCompanyDataHooks({
        query: 'ROSTER',
    })

    const createTransaction = (data: ICreateTransaction) => {
        const description = `${data?.type.toLocaleUpperCase()} - ${data?.user?.name} - ${formatDate({
            date: new Date(),
            f: "dd/MM/yyyy"
        })} - ${convertCentsToEuro(Number(data?.value))}`

        const newTransaction: IPOSTTransactionsBody['one'] = {
            type: data?.type,
            method: TransactionsMethod.PAYROLL,
            direction: TransactionsDirection.OUT,
            date: usersParams?.roster?.rosterPayment?.date?.gte,
            total: data?.value,
            description,

            valid_by_id: user?.user_id,
            valid_by: user?.name,

            payee: data?.user?.name,
            payee_key: data?.user?.id,
        }

        const transactionAlreadyExist = transaction?.find(t => t.payee_key === newTransaction?.payee_key && t?.type === newTransaction?.type)

        if (!transactionAlreadyExist && newTransaction?.total > 0) {
            setTransaction(prev => {
                return [...prev, newTransaction]
            })
        }

        if (newTransaction?.total !== transactionAlreadyExist?.total) {
            setTransaction(prev => {
                const index = prev?.findIndex(t => t.payee_key === newTransaction?.payee_key && t?.type === newTransaction?.type)
                prev[index] = newTransaction
                return [...prev]
            })
        }

        return newTransaction
    }

    const saveSession = useDebounce(() => {
        sessionStorage.setItem(`payments-${formatDate({
            date: usersParams?.roster?.rosterPayment?.date?.gte!
        })}`, JSON.stringify(transaction))
    }, 2000)

    const getSession = () => {
        const local = sessionStorage.getItem(`payments-${formatDate({
            date: usersParams?.roster?.rosterPayment?.date?.gte!
        })}`)
        if (!local) return
        setTransaction(JSON.parse(local))
    }


    useEffect(() => {
        saveSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction])

    useEffect(() => {
        setTransaction([])
        getSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersParams?.roster?.rosterPayment?.date?.gte])

    return (
        <div className='flex-col-container'>
            <RosterPaymentHeader
                transactions={transaction || []}
                setTransactions={setTransaction}
                setUsersParams={setUsersParams}
                usersParams={usersParams}
                users={users?.users || []}
                createTransactions={createTransactions}
                isCreateTransactionsLoading={isCreateTransactionsLoading}
                updateRoster={updateRoster}
            />
            <div className='flex-col-container gap-8 mt-4'>
                {departments?.map(d => {
                    return (
                        <Wrap
                            key={d?.id}
                            header={{
                                title: {
                                    icon: 'SquareStack',
                                    title: d?.title
                                }
                            }}
                            actions={{
                                dateChange: {
                                    datePickerWithRange: {
                                        onConfirm: (data) => {
                                            setUsersParams(() => ({
                                                roster: {
                                                    rosterPayment: {
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
                                                        },
                                                        status: 'Working'
                                                    }
                                                }
                                            }))
                                        },
                                        value: {
                                            from: usersParams?.roster?.rosterPayment?.date?.gte,
                                            to: usersParams?.roster?.rosterPayment?.date?.lte
                                        },
                                        className: 'w-64'
                                    }
                                }
                            }}
                        >
                            <RosterPaymentTable
                                users={users?.users?.filter(u => u?.role?.departament_id === d?.id) || []}
                                createTransaction={createTransaction}
                                transactions={transaction || []}
                            />
                        </Wrap>
                    )
                })}
            </div>
        </div>
    )

}