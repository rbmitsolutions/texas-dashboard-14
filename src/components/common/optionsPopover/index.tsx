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

export interface IOptionsPopover {
    options: {
        label: string
        placeholder: string
        options: {
            value: string
            label: string | number | JSX.Element | React.ReactNode
            isDisabled?: boolean
        }[]
        onChange: (e: string) => void
    }[]
}

export default function OptionsPopover({ options }: IOptionsPopover) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size='icon' variant='outline'><Icon name="ListFilter" /></Button>
            </PopoverTrigger>
            <PopoverContent className="flex-col-container">
                {options.map((selectOption) => {
                    return (
                        <Select key={selectOption?.label} onValueChange={(e: string) => selectOption?.onChange(e)}>
                            <SelectTrigger >
                                <SelectValue placeholder={selectOption?.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{selectOption?.label}</SelectLabel>
                                    {selectOption?.options.map(option => {
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