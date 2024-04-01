import { useEffect, useState } from "react"

//components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/common/libs/shadcn/utils"
import Icon from "@/common/libs/lucida-icon"
import { Skeleton } from "@/components/ui/skeleton"

//interface
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface"

export interface PaginationProps {
    queryPagination: IQueryPagination
    pagination: IPaginationResponse
    onPageChange: (pagination: IQueryPagination) => void
    isFetching?: boolean
}

export default function Pagination({
    queryPagination,
    pagination,
    onPageChange,
    isFetching
}: PaginationProps) {
    const [preRendered, setPreRendered] = useState(false);
    const handlePagination = (isNext: boolean): void => {
        const page = isNext ? pagination?.currentPage + 1 : pagination?.currentPage - 1;
        onPageChange({
            take: queryPagination?.take,
            skip: (page - 1) * queryPagination?.take
        });
    }

    const createArray = (currentPage: number, maxPages: number): number[] => {
        const array = [];
        if (maxPages > 50) {
            for (let i = currentPage; i <= currentPage + 39; i += 10) {
                array.push(i);
            }
        } else {
            for (let i = currentPage; i <= currentPage + 3; i++) {
                array.push(i);
            }
        }
        return array.filter(item => item <= maxPages);
    }


    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <Pagination.Skeleton />;
    }

    return (
        <div className='flex-container items-center'>
            <Button
                size='icon'
                className='h-7 w-7'
                disabled={pagination?.currentPage === 1 || isFetching}
                onClick={() => handlePagination(false)}>
                <Icon name='ChevronLeft' size={14} />
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button size='icon' variant='outline' className='h-8 min-w-16 text-xs'>
                       {pagination?.currentPage} / {pagination?.maxPages}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='flex-col-container gap-3 bg-background p-2 w-[180px]'>
                    <small>Pagination</small>
                    <div className='flex gap-2 h-8'>
                        {
                            createArray(pagination?.currentPage, pagination?.maxPages).map((item, index) => (
                                <Button
                                    key={index}
                                    size='icon'
                                    onClick={() => onPageChange({
                                        take: queryPagination?.take,
                                        skip: (item - 1) * queryPagination?.take
                                    })}
                                    variant='ghost'
                                    disabled={isFetching}
                                    className={cn('border-2 h-8', item === pagination?.currentPage && 'border-blue-600 text-xs')}
                                >
                                    {item}
                                </Button>
                            ))
                        }
                    </div>
                    <div className='flex justify-between items-center gap-2 h-8'>
                        <Button
                            size='icon'
                            className='w-full h-8'
                            disabled={pagination?.currentPage === 1 || isFetching}
                            onClick={() => handlePagination(false)}>
                            <Icon name='ChevronLeft' size={14} />
                        </Button>
                        <Button
                            size='icon'
                            className='w-full h-8 text-xs'
                            variant='outline'
                            disabled={pagination?.currentPage === 1 || isFetching}
                            onClick={() => onPageChange({
                                take: queryPagination?.take,
                                skip: 0
                            })}
                        >
                            First
                        </Button>
                        <Button
                            size='icon'
                            className='w-full h-8 text-xs'
                            variant='outline'
                            disabled={!pagination?.hasNextPage || pagination?.currentPage === pagination?.maxPages || isFetching}
                            onClick={() => onPageChange({
                                take: queryPagination?.take,
                                skip: (pagination?.maxPages - 1) * queryPagination?.take
                            })}
                        >
                            Last
                        </Button>
                        <Button
                            size='icon'
                            className='w-full h-8'
                            disabled={!pagination?.hasNextPage || pagination?.currentPage === pagination?.maxPages || isFetching}
                            onClick={() => handlePagination(true)}
                        >
                            <Icon name='ChevronRight' size={14} />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
            <Button
                size='icon'
                className='h-7 w-7'
                disabled={!pagination?.hasNextPage || pagination?.currentPage === pagination?.maxPages || isFetching}
                onClick={() => handlePagination(true)}
            >
                <Icon name='ChevronRight' size={14} />
            </Button>
        </div>
    )

}

Pagination.Skeleton = function PaginationSkeleton() {
    return (
        <div className='flex-container items-center'>
            <Skeleton
                className='h-7 w-7'
            />
            <Skeleton className='h-8 w-20' />
            <Skeleton
                className='h-7 w-7'
            />
        </div>
    )
}