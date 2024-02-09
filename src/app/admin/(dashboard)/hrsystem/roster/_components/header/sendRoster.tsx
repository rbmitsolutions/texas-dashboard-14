import Icon from "@/common/libs/lucida-icon";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IGETCompanyDataQuery } from "@/hooks/company/IGetCompanyDataHooks.interface";
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";
import { UseMutateFunction } from "react-query";

interface SendRosterProps {
    usersParams: IGETCompanyDataQuery
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export default function SendRoster({ updateRoster, usersParams }: SendRosterProps): JSX.Element {

    const handleSendRoster = async () => {
        const between = {
            gte: usersParams.roster?.rosterPage?.date?.gte || new Date(),
            lte: usersParams.roster?.rosterPage?.date?.lte || new Date()
        }
        // const rosters_ids = users?.map(user => user?.roster?.filter(r => !r.available).map(r => r.id)).flat() || []

        await updateRoster({
            roster: {
                many: {
                    between,
                    available: true,
                    send_email: between
                }
            }
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size='iconSm' variant='yellow'>
                    <Icon name="Send" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-32" align="start">
                <h1>Send Roster</h1>
                <Button
                    className='mt-4'
                    leftIcon="Send"
                    onClick={handleSendRoster}
                >Send</Button>
            </PopoverContent>
        </Popover>
    )
}