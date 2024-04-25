import { useState } from "react";

//interfaces
import { Input } from "@/components/ui/input";
import { IOrderChange } from "../page";

interface StockOrderInputProps {
    onOrderChange: (data: IOrderChange) => void
    type: IOrderChange['type']
    orderId: string
    value?: number
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default function StockOrderInput({
    onOrderChange,
    type,
    value: v,
    orderId,
    inputProps
}: StockOrderInputProps): JSX.Element {
    const [displayValue, setDisplayValue] = useState<number>(v || 0)

    const value = (value: number, type: IOrderChange['type']) => {
        if (type !== 'vat') {
            return value * 100
        }
        return value
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        onOrderChange({
            orderId,
            type,
            value: value(Number(e.target.value), type)
        })
    }

    return (
        <>
            <Input
                value={(type !== 'vat') ? displayValue / 100 : displayValue}
                onChange={(e) => setDisplayValue(value(Number(e.target.value), type))}
                onBlur={(e) => onBlur(e)}
                type='number'
                step='0.01'
                className='min-w-24'
                {...inputProps}
            />
        </>
    )
}