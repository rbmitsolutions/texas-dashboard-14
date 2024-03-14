//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import { Button } from "@/components/ui/button"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"

interface MenuOptionsComponentProps {
    options: IGETMenuOrderSystemResponse[]
    updateMenuItem: (data: IGETMenuOrderSystemResponse) => void
}


export default function MenuOptionsComponent({ options, updateMenuItem }: MenuOptionsComponentProps) {

    const optionBgColor = (priority: number) => {
        if (priority === 1) {
            return '!bg-blue-100 dark:!bg-blue-400/60'
        } else if (priority === 2) {
            return '!bg-blue-300/80 dark:!bg-blue-400/80'
        } else if (priority === 3) {
            return '!bg-blue-400/80 dark:!bg-blue-300'
        }
    }

    return (
        <div className='flex justify-center items-center  w-full h-full'>
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3  w-full'>
                {options?.map((option, index) => {
                    return (
                        <Button
                            key={index}
                            type='button'
                            className={cn('flex-container-center justify-center min-h-40 max-h-60 h-full w-full rounded-xl border-2 ', optionBgColor(option?.options_priority))}
                            onClick={() => updateMenuItem(option)}
                        >
                            <h1>{option?.short_title}</h1>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}

