import { ITransactions, TransactionsDirection, TransactionsStatus } from '@/common/types/company/transactions.interface';
import { create } from 'zustand';

export interface TransactionsState {
    transactions: ITransactions[]
    transactionFilter: {
        payee_key?: string
        status?: TransactionsStatus
    },
    setTransactionFilter: (filter: TransactionsState['transactionFilter']) => void
    setTransactions: (transactions: ITransactions[]) => void
    getTransactionsTotalByFilter: (transactionFilter: TransactionsState['transactionFilter']) => number
    getTransactionsByFilter: (transactionFilter: TransactionsState['transactionFilter']) => ITransactions[]
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
    transactions: [],
    setTransactions: (transactions) => set({ transactions }),
    transactionFilter: {
        payee_key: '',
    },
    setTransactionFilter: (filter) => set({ transactionFilter: filter }),
    getTransactionsTotalByFilter: (filter) => {
        let transactions: ITransactions[] = useTransactionsStore.getState().transactions

        if (filter.payee_key) {
            transactions = transactions.filter(transaction => transaction.payee_key === filter.payee_key)
        }

        if(filter.status) {
            transactions = transactions.filter(transaction => transaction.status === filter.status)
        }

        const total = transactions.reduce((acc, transaction) => {
            if (transaction.direction === TransactionsDirection.TIP || transaction.direction === TransactionsDirection.IN || transaction.direction === TransactionsDirection.VOUCHER) {
                return acc + transaction.total
            } else {
                return acc - transaction.total
            }
        }, 0)

        return total
    },
    getTransactionsByFilter: (filter) => {
        let transactions: ITransactions[] = useTransactionsStore.getState().transactions

        if (filter.payee_key) {
            transactions = transactions.filter(transaction => transaction.payee_key === filter.payee_key)
        }

        if(filter.status) {
            transactions = transactions.filter(transaction => transaction.status === filter.status)
        }

        return transactions
    }
}));
