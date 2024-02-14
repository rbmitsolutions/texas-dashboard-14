import { UseMutateFunction } from "react-query"
import Icon from "@/common/libs/lucida-icon"

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"

//components
import { Permissions } from "@/common/types/auth/auth.interface"
import { IRosterTasks } from "@/common/types/company/roster.interface"
import InfoBadge from "@/components/common/infoBadge"
import { Button } from "@/components/ui/button"

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { useAuthHooks } from "@/hooks/useAuthHooks"

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
                <Button
                    size='iconExSm'
                    variant='destructive'
                    onClick={async () => {
                        await deleteRosterTask({
                            rosterTask: {
                                id: task?.id
                            }
                        })
                    }}
                    disabled={!isUserAuthorized(
                        user,
                        [Permissions.ROSTER_TASKS]
                    ) || task?.done}
                    type='button'
                >
                    <Icon name='Trash' size={8} />
                </Button>
            </div>
        </div>
    )
}