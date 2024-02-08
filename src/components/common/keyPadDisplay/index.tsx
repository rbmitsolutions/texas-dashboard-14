import { cn } from "@/common/libs/shadcn/utils";
import { Button } from "@/components/ui/button";
import React from "react";

interface IKeyPadDisplay {
    displayValue: string
    onChange: (e: number, remove?: boolean) => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    buttonClassName?: string;
    deleteButtonClassName?: string;
    displayClassName?: string;
}

const styles = {
    button: 'w-full h-16 text-2xl bg-background-soft rounded-lg shadow-lg text-black hover:bg-background-soft dark:text-white'
}

export const KeyPadDisplay = ({ displayValue, onChange, buttonClassName, deleteButtonClassName, displayClassName, isDisabled = false, isLoading = false }: IKeyPadDisplay): JSX.Element => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const handleChange = (e: number, remove?: boolean) => {
        onChange(e, remove)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const { key } = event;
        if (!isNaN(parseInt(key))) {
            handleChange(parseInt(key));
        } else if (key === "Backspace") {
            handleChange(0, true)
        }
    }

    return (
        <div className="p-2 mt-4">
            <div className={cn("flex justify-center items-center bg-background-soft h-14 rounded-lg shadow-lg", displayClassName)}>
                <h2 className="text-3xl">{displayValue || '  -  '}</h2>
            </div>
            <div className="mt-6">
                <div className="grid grid-cols-3 gap-4">
                    {numbers.map((n, index) => (
                        <Button
                            key={index}
                            onClick={() => handleChange(parseInt(n))}
                            onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLButtonElement>)}
                            disabled={isDisabled || isLoading}
                            className={cn(styles.button, buttonClassName)}
                            isLoading={isLoading}
                        >
                            {!isLoading && n}
                        </Button>
                    ))}
                    <Button
                        onClick={() => handleChange(0)}
                        onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLButtonElement>)}
                        disabled={isDisabled || isLoading}
                        className={cn(styles.button, `col-span-2 ${deleteButtonClassName}`)}
                        isLoading={isLoading}
                    >
                        {!isLoading && 0}
                    </Button>
                    <Button
                        onClick={() => handleChange(0, true)}
                        onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLButtonElement>)}
                        disabled={isDisabled || isLoading}
                        className={cn("w-full h-16 text-2xl bg-red-700 hover:bg-red-600 rounded-lg shadow-lg", deleteButtonClassName)}
                        isLoading={isLoading}
                    >
                        {!isLoading && 'Del'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
