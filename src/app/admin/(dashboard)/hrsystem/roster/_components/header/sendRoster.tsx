import Icon from "@/common/libs/lucida-icon";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function SendRoster(): JSX.Element {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size='iconSm' variant='yellow'>
                    <Icon name="Send"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-32" align="start">
                    <h1>Send Roster</h1>
                    <Button className='mt-4' leftIcon="Send">Send</Button>
            </PopoverContent>
        </Popover>
    )
}