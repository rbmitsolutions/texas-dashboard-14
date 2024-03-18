import { Allergens } from "@/common/types/restaurant/menu.interface";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IMenuOrderSystemFilter } from "@/hooks/useOrderSystemHooks";

interface AllergensButtonProps {
    filter: IMenuOrderSystemFilter,
    setFilter: React.Dispatch<React.SetStateAction<IMenuOrderSystemFilter>>
}
export default function AllergensButton({ filter, setFilter }: AllergensButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button 
                variant={filter?.allergens && filter?.allergens?.length > 0 ? 'destructive' : 'outline'}
                className='w-full my-2'
                
                >Allergens</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className='grid grid-cols-2 gap-2 py-2 scrollbar-thin'>
                    {Object.values(Allergens).map(a => {
                        return (
                            <label key={a}
                                htmlFor={a}
                                className='flex items-center gap-1 text-xs'
                            >
                                <Checkbox
                                    id={a}
                                    checked={filter?.allergens?.includes(a)}
                                    onCheckedChange={(e) => setFilter(prev => {
                                        if (e) {
                                            return {
                                                ...prev,
                                                allergens: [...prev?.allergens || [], a]
                                            }
                                        } else {
                                            return {
                                                ...prev,
                                                allergens: prev?.allergens?.filter((al) => al !== a)
                                            }
                                        }
                                    })}
                                />
                                <span className='line-clamp-1'>{a}</span>
                            </label>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}