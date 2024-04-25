'use client'
import { useState } from "react"

//interface
import { IMenuToMake } from "@/common/types/restaurant/menu.interface"
import { Input } from "@/components/ui/input"

interface MenuItemToMakeQuantityProps {
    menuToMake: IMenuToMake
    updateMenuToMake: (value: number) => void
}

export default function MenuItemToMakeQuantity({ menuToMake, updateMenuToMake }: MenuItemToMakeQuantityProps) {
    const [displayValue, setDisplayValue] = useState<number>(menuToMake?.quantity || 0)

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        updateMenuToMake(Number(e.target.value))
    }

    return (
        <div className='flex-container items-center'>
            <Input
                value={displayValue}
                onChange={(e) => setDisplayValue(Number(e.target.value))}
                onBlur={(e) => onBlur(e)}
                type='number'
                step='0.01'
                min='0'
            />
            <strong>{menuToMake?.item?.unit}</strong>
        </div>
    )
}