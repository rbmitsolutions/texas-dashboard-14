import { UseMutateFunction } from "react-query"

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"

//components
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { IRosterTasks } from "@/common/types/company/roster.interface"
import { Permissions } from "@/common/types/auth/auth.interface"
import InfoBadge from "@/components/common/infoBadge"

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { useAuthHooks } from "@/hooks/useAuthHooks"
import { isDateBeforeDate, subDaysToDate } from "@/common/libs/date-fns/dateFormat"

interface RosterTasksDisplayProps {
    task: IRosterTasks
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function RosterTasksDisplay({ task, deleteRosterTask }: RosterTasksDisplayProps): JSX.Element {
    const { user } = useAuthHooks()
    return (
        <div key={task?.id} className='flex justify-between gap-1 bg-background-soft p-2 rounded-md hover:bg-foreground/10'>
            <small className='line-clamp-1'>
                {task?.form}
            </small>
            <div className='flex gap-2'>
                {task?.done ? <InfoBadge status="done" /> : <InfoBadge status="pending" />}
                <DeleteDialogButton
                    onDelete={async () => {
                        await deleteRosterTask({
                            rosterTask: {
                                id: task?.id
                            }
                        })
                    }}
                    isDisabled={!isUserAuthorized(
                        user,
                        [Permissions.ROSTER_TASKS]
                    ) || task?.done}
                    buttonProps={{
                        size: 'iconSm',
                        type: 'button'
                    }}
                />
            </div>
        </div>
    )
}