import Icon from "@/common/libs/lucida-icon";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";

export interface OptionsPopoverProps {
    options: {
        label: string
        placeholder: string
        options: {
            value: string
            label: string | number | JSX.Element | React.ReactNode
            isDisabled?: boolean
        }[],
        value: string;
        onChange: (e: string) => void
    }[],
    isLoading?: boolean
}

export default function OptionsPopover({ options, isLoading = false }: OptionsPopoverProps) {
    if(isLoading || !options) return  <OptionsPopover.Skeleton />
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size='icon' variant='outline'><Icon name="ListFilter" /></Button>
            </PopoverTrigger>
            <PopoverContent className="flex-col-container">
                {options?.map((selectOption) => {
                    return (
                        <Select key={selectOption?.label} value={selectOption?.value} onValueChange={(e: string) => selectOption?.onChange(e)}>
                            <SelectTrigger >
                                <SelectValue placeholder={selectOption?.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{selectOption?.label}</SelectLabel>
                                    {selectOption?.options?.map(option => {
                                        return (
                                            <SelectItem key={option?.value} value={option?.value} disabled={option?.isDisabled}>{option?.label}</SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )
                })}
            </PopoverContent>
        </Popover>
    )
}

OptionsPopover.Skeleton = function OptionsPopoverSkeleton() {
    return (
        <Skeleton
            className='h-8 w-8'
        />
    )
}