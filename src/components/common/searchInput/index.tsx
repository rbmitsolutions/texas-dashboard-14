import Icon from "@/common/libs/lucida-icon";
import { cn } from "@/common/libs/shadcn/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export interface ISearchInput {
    onSearchChange: (e: string) => void;
    debounceDelay?: number;
    value: string;
    custom?: string;
    placeholder?: string;
}

const useDebounce = (fn: any, delay: number) => {
    const timeoutRef = useRef(null);
    function debouncedFn(...args: any) {
        window.clearTimeout(timeoutRef.current as any);
        timeoutRef.current = window.setTimeout(() => {
            fn(...args);
        }, delay) as any;
    }

    return debouncedFn;
}

export default function SearchInput({ onSearchChange, value, placeholder = 'Search ...', debounceDelay = 600, custom }: ISearchInput) {
    const [displayValue, setDisplayValue] = useState<string>(value);
    const debouncedChange = useDebounce(onSearchChange, debounceDelay);

    const handleChange = (e: string) => {
        setDisplayValue(e);
        debouncedChange(e);
    }



    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    return (
        <div className="relative">
            <Input
                onChange={(e: any) => handleChange(e.target.value)}
                value={displayValue}
                placeholder={placeholder}
                className={cn('w-full', custom)}
            />
            {displayValue?.length > 0 ? (
                <Button className='absolute h-6 w-6 top-[6px] p-0 right-2' variant='ghost'>
                    <Icon
                        name='XCircle'
                        onClick={() => handleChange("")}
                        size={10}
                        className='text-red-400'
                    />
                </Button>
            ) :
                <Icon name='Search' size={14} className='absolute top-[10px] p-0 right-4' />
            }
        </div>
    )
}