import { cn } from "@/common/libs/shadcn/utils"
import { Button } from "@/components/ui/button"
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"

interface MenuOptionsComponentProps {
    options: IGETMenuOrderSystemResponse[]
    updateMenuItem: (data: IGETMenuOrderSystemResponse) => void
}


export default function MenuOptionsComponent({ options, updateMenuItem }: MenuOptionsComponentProps) {
    return (
        <div className='flex justify-center items-center  w-full h-full'>
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3  w-full'>
                {options?.map((option, index) => {
                    return (
                        <Button
                            key={index}
                            type='button'
                            className={cn('flex-container-center justify-center min-h-40 max-h-60 h-full w-full rounded-xl border-2 text-black dark:text-white hover:bg-background-soft',
                                option?.options_priority === 1 && 'bg-background-soft',
                                option?.options_priority === 2 && 'bg-blue-300 hover:bg-blue-300 dark:bg-blue-900 dark:hover:bg-blue-900',
                                option?.options_priority === 3 && 'bg-green-400 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-700',
                            )}
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

