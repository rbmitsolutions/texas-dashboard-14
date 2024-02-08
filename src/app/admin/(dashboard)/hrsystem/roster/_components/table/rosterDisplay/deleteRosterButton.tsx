import { UseMutateFunction } from "react-query"

//libs
import { subDaysToDate } from "@/common/libs/date-fns/dateFormat"

//compoenents
import Icon from "@/common/libs/lucida-icon"
import { IRoster } from "@/common/types/company/roster.interface"
import { Button } from "@/components/ui/button"

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"

interface DeleteRosterButtonProps {
    roster: IRoster
    deleteRoster: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function DeleteRosterButton({ roster, deleteRoster }: DeleteRosterButtonProps): JSX.Element {
    return (
        <Button
            className='h-4 w-4 p-1'
            variant='destructive'
            disabled={new Date(roster?.date!) < subDaysToDate(new Date(), 1) || roster?.status === 'dayoff' || roster?.status === 'holiday' || roster?.status === 'sickday'}
            onClick={async () => {
                await deleteRoster({
                    roster: {
                        id: roster?.id
                    }
                })
            }}
        >
            <Icon name='X' size={8} />
        </Button>
    )
}