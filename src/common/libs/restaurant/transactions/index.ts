import { ITransactions, TransactionsDirection, TransactionsStatus } from "@/common/types/company/transactions.interface"

interface IGerTransactionsTotalByFilter {
    filter: {
        payee_key?: string
        status?: TransactionsStatus
    }
    transactions: ITransactions[]
}
export const transactionsTotalByFilter = ({ filter, transactions }: IGerTransactionsTotalByFilter): number => {
    let transactionTotal: ITransactions[] = transactions

    if (filter.payee_key) {
        transactionTotal = transactionTotal.filter(transaction => transaction.payee_key === filter.payee_key)
    }

    if (filter.status) {
        transactionTotal = transactionTotal.filter(transaction => transaction.status === filter.status)
    }

    const total = transactionTotal.reduce((acc, transaction) => {
        if (transaction.direction === TransactionsDirection.TIP || transaction.direction === TransactionsDirection.IN || transaction.direction === TransactionsDirection.VOUCHER) {
            return acc + transaction.total
        } else {
            return acc - transaction.total
        }
    }, 0)

    return total
}