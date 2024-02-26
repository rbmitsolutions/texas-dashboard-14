import useScanDetection from "use-scan-detection";

//components
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/common/libs/lucida-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/common/libs/shadcn/utils";
import { useDebounce } from "@/common/utils/useDebouce";

export interface ScanInputProps {
    onSearchChange: (e: string) => void;
    cleanSearch?: () => void;
    value: string;
    custom?: string;
    debounceDelay?: number;
    placeholder?: string;
    isFetching?: boolean;
    inputClassName?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}


export default function ScanInput({ onSearchChange, cleanSearch, value, isFetching, inputClassName, placeholder = 'Scan Gift Card', custom, debounceDelay = 500, inputProps }: ScanInputProps) {
    const [preRendered, setPreRendered] = useState(false);
    const [displayValue, setDisplayValue] = useState<string>(value || '');
    const debouncedChange = useDebounce(onSearchChange, debounceDelay);

    const handleChange = (e: string) => {
        setDisplayValue(e);
        debouncedChange(e);
    }

    const clearSerchWithoutDebounce = () => {
        setDisplayValue('');
        onSearchChange('');
        cleanSearch && cleanSearch()
    }

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    useEffect(() => {
        setPreRendered(true);
    }, [])

    useScanDetection({
        onComplete: (code) => {
            handleChange(String(code.replace(/[^0-9]/g, "")));
        },
        minLength: 3,
    });

    if (!preRendered || isFetching) {
        return <ScanInput.Skeleton />;
    }

    return (
        <div className={cn('w-full relative max-w-lg', custom)}>
            <Input
                {...inputProps}
                onChange={(e: any) => handleChange(e.target.value)}
                value={displayValue || ''}
                placeholder={placeholder}
                className={inputClassName}
            />
            {displayValue?.length > 0 ? (
                <Button className='absolute h-6 w-6 top-[50%] translate-y-[-50%] p-0 right-2' variant='ghost'>
                    <Icon
                        name='XCircle'
                        onClick={() => clearSerchWithoutDebounce()}
                        size={10}
                        className='text-red-400'
                    />
                </Button>
            ) :
                <Icon name='Search' size={14} className='absolute top-[50%] translate-y-[-50%] p-0 right-4' />
            }
        </div>
    )
}

ScanInput.Skeleton = function PaginationSkeleton() {
    return (
        <Skeleton
            className='h-8 w-full'
        />
    )
}