import { useRouter } from "next/navigation"
import { UseMutateFunction } from "react-query"

//components
import { rosterBackground } from "@/common/libs/company/roster"
import { formatDate, isToday } from "@/common/libs/date-fns/dateFormat"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//interface
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"
import { IRoster } from "@/common/types/company/roster.interface"

interface RosterDisplayProps {
    roster: IRoster
    updateRoster: UseMutateFunction<any, any, IPUTUserBody, unknown>
}

export default function RosterDisplay({ roster, updateRoster }: RosterDisplayProps) {
    const router = useRouter()

    const handlUpdateRoster = async () => {
        if (roster?.status !== 'unconfirmed') return
        await updateRoster({
            roster: {
                one: {
                    id: roster?.id,
                    status: 'confirmed',
                    confirmed: true,
                }
            }
        })
    }

    return (
        <div className='flex-container justify-between border-2 rounded-lg shadow-lg bg-background-soft'>
            <div className='flex-col-container p-4 w-full'>
                <div className='flex justify-between w-full'>
                    <span>
                        {formatDate({
                            date: new Date(roster?.date!),
                            f: 'dd/MM/yyyy'
                        })}
                    </span>
                    <Switch
                        checked={roster?.status === "confirmed"}
                        onClick={handlUpdateRoster}
                        disabled={new Date(roster?.date!) < new Date() || roster?.status === 'confirmed'}
                    />
                </div>
                <span className="capitalize">
                    {roster?.day_in_lieu ? 'Day In Lieu' : roster?.duty}
                </span>
                <span className="capitalize">
                    {roster?.day_in_lieu ? 'Day In Lieu' : roster?.shift}
                </span>
                {roster?.tasks?.map(task => {
                    return (
                        <Button
                            key={task?.id}
                            disabled={task?.done || !isToday(new Date(roster?.date!))}
                            className='text-pretty text-left leading-[18px] h-22'
                            onClick={() => router.push(`/admin/task/${task?.id}`)}
                        >
                            {task?.form}
                        </Button>
                    )
                })}
            </div>
            <div className={cn('w-8 min-w-8 max-w-8 rounded-r-md', roster?.day_in_lieu ? 'bg-pink-300 dark:bg-pink-900' : rosterBackground(roster?.status!, true))} />
        </div >
    )
}