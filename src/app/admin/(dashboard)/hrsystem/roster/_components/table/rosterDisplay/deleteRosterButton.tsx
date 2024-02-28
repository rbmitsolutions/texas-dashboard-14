import { UseMutateFunction } from "react-query"

//libs
import { isDateBeforeDate, subDaysToDate } from "@/common/libs/date-fns/dateFormat"

//compoenents
import { IRoster } from "@/common/types/company/roster.interface"

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

interface DeleteRosterButtonProps {
    roster: IRoster
    deleteRoster: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function DeleteRosterButton({ roster, deleteRoster }: DeleteRosterButtonProps): JSX.Element {
    const isBeforeYesterday = isDateBeforeDate(new Date(roster?.date!), subDaysToDate(new Date(), 1))

    const disableButton = isBeforeYesterday && (roster?.status === 'confirmed' || roster?.status === 'unconfirmed')
    return (
        <DeleteDialogButton
            onDelete={async () => {
                await deleteRoster({
                    roster: {
                        id: roster?.id
                    }
                })
            }}
            isDisabled={disableButton}
            buttonProps={{
                className: 'h-4 w-4 p-1',
            }}
        />

    )
}