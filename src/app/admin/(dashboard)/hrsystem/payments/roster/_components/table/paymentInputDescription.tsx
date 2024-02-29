import { useEffect, useState } from "react";

//interfaces
import { PayrollTransactionsType } from "@/common/types/company/transactions.interface";
import { IPOSTTransaction } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IUserExtraPaymentData } from "@/hooks/company/IGetCompanyDataHooks.interface";
import { Input } from "@/components/ui/input";
import { ICreateTransaction } from "..";

interface PaymentInputDescriptionProps {
    type: PayrollTransactionsType
    user: IUserExtraPaymentData
    createTransaction: (data: ICreateTransaction) => IPOSTTransaction
    transactions: IPOSTTransaction[]
}

export default function PaymentInputDescription({
    type,
    user,
    createTransaction,
    transactions
}: PaymentInputDescriptionProps): JSX.Element {
    const [displayValue, setDisplayValue] = useState<number>(() => {
        const transaction = transactions.find(t => t.payee_key === user.id && t.type === type)
        return transaction?.total || 0
    })

    const onBlur = (e : React.FocusEvent<HTMLInputElement>) => {
        const transaction = createTransaction({
            value: Number(e.target.value) * 100,
            type,
            user
        })

        setDisplayValue(transaction.total)
    }

    useEffect(() => {
        if(transactions.length === 0){
            setDisplayValue(0)
        }
    }, [transactions])
    return (
        <>
            <Input
                value={displayValue / 100}
                onChange={(e) => setDisplayValue(Number(e.target.value) * 100)}
                onBlur={(e) => onBlur(e)}
                type='number'
                step='0.01'
            />
        </>
    )
}