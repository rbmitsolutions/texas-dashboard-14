import { icons } from 'lucide-react';
import Icon from "@/common/libs/lucida-icon"
import LoadingError from '../loadingError';
import { cn } from '@/common/libs/shadcn/utils';

interface InfoBoxProps {
    icon: {
        name: keyof typeof icons,
        size?: number
        className?: string
    }
    title: string
    value: string | number
    smallValue?: string
    isLoading?: boolean
    error?: boolean
}

export default function InfoBox({
    icon, title, value, smallValue, isLoading = false, error = false,
}: InfoBoxProps): JSX.Element {
    return (
        <div className='flex items-center justify-end p-3 gap-4 rounded-xl bg-background-soft'>
            <div>
                {isLoading || error ?
                    <LoadingError isLoading={isLoading} error={error} />
                    :
                    <div className='flex flex-col items-end'>
                        <p className='text-xs font-bold text-slate-400 dark:text-slate-500 line-clamp-1 capitalize'>{title.toLocaleLowerCase()}</p>
                        <p className='text-sm font-bold text-primary'>{value}</p>
                        <p className='text-xs text-end text-slate-400 dark:text-slate-500 capitalize'>{smallValue ? smallValue.toLocaleLowerCase() : '-'}</p>
                    </div>
                }
            </div>
            <div className='flex items-center justify-center min-h-14 min-w-14 rounded-full border-primary bg-slate-100 dark:bg-slate-800'>
                <Icon name={icon?.name} size={icon?.size || 20} className={cn('text-primary', icon?.className || '')} />
            </div>
        </div>
    )
}