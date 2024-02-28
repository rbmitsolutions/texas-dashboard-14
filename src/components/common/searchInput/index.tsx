import { useEffect, useState } from "react";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//libs
import { useDebounce } from "@/common/utils/useDebouce";
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon";

export interface SearchInputProps {
    onSearchChange: (e: string) => void;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    cleanSearch?: () => void;
    debounceDelay?: number;
    value: string;
    custom?: string;
    placeholder?: string;
    isFetching?: boolean;
}

export default function SearchInput({ onSearchChange, inputProps, cleanSearch, value, isFetching, placeholder = 'Search ...', debounceDelay = 600, custom }: SearchInputProps) {
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

    if (!preRendered || isFetching) {
        return <SearchInput.Skeleton />;
    }

    return (
        <div className={cn('w-full relative max-w-lg', custom)}>
            <Input
                onChange={(e: any) => handleChange(e.target.value)}
                value={displayValue || ''}
                placeholder={placeholder}
                {...inputProps}
            />
            {displayValue?.length > 0 ? (
                <Button className='absolute h-6 w-6 top-[6px] p-0 right-2' variant='ghost'>
                    <Icon
                        name='XCircle'
                        onClick={() => clearSerchWithoutDebounce()}
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

SearchInput.Skeleton = function PaginationSkeleton() {
    return (
        <Skeleton
            className='h-8 w-full'
        />
    )
}