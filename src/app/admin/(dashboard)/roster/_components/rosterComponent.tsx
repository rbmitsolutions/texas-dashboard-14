import { useRouter } from "next/navigation"
import { UseMutateFunction } from "react-query"

//components
import { rosterBackground } from "@/common/libs/company/roster"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//hooks
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"

//interface
import { IRoster } from "@/common/types/company/roster.interface"

interface RosterComponentProps {
    roster: IRoster
    updateRoster: UseMutateFunction<void, any, IPUTCompanyBody, unknown>
}

export default function RosterComponent({ roster, updateRoster }: RosterComponentProps) {
    const router = useRouter()

    const handlUpdateRoster = async () => {
        if (roster?.status !== 'unconfirmed') return
        await updateRoster({
            roster: {
                id: roster?.id,
                status: 'confirmed',
                confirmed: true,
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
                        className='bg-orange-200'
                        checked={roster?.status === "confirmed"}
                        onClick={handlUpdateRoster}
                    />
                </div>
                <span className="capitalize">{roster?.duty?.toLowerCase()}</span>
                <span className="capitalize">{roster?.shift?.toLowerCase()}</span>
                {roster?.tasks_title?.map(task => {
                    return (
                        <Button
                            key={task}
                            disabled={task?.toLowerCase().split(" ").includes("done") ||
                                new Date().getDate() !== new Date(roster?.date!).getDate() ||
                                roster.status === "sickday"
                            }
                            className='text-pretty text-left leading-[18px] h-22'
                            onClick={() => router.push(`/admin/task/${task}/${roster.id}`)}
                        >
                            {task}
                        </Button>
                    )
                })}
            </div>
            <div className={cn('w-8 min-w-8 max-w-8 rounded-r-md', rosterBackground(roster?.status!, true))} />
        </div >
    )
}