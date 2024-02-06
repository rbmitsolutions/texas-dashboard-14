//libs
import { rosterBackground } from "@/common/libs/company/roster"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"
import Icon from "@/common/libs/lucida-icon"

//interface
import { IRoster } from "@/common/types/company/roster.interface"

interface RosterDisplayProps {
    roster: IRoster[]
    //todo: add available type
    available: any
}

export default function RosterDisplay({ roster, available }: RosterDisplayProps): JSX.Element {
    return (
        <div className='p-1 h-full'>
            {roster?.length === 0 ?
                <div className='flex items-center justify-center h-full w-full '>
                    <p className='text-[10px] text-foreground/30'><i>No roster available</i></p>
                </div>
                :
                <div className='flex flex-col gap-2'>
                    {roster?.map(r => {
                        return (
                            <div key={r.id} className={cn('flex flex-col relative h-full gap-2 rounded-md p-2', rosterBackground(r?.status!, true))}>
                                {r?.paid && (
                                    <Icon
                                        name='Banknote'
                                        className='absolute top-[-8px] left-[-4px] text-green-600'
                                        size={20}
                                    />
                                )}
                                <div className='flex justify-between items-center'>
                                    <small className='text-[10px]'>
                                        {formatDate({
                                            date: new Date(r?.date!),
                                            f: 'dd/MM/yyyy'
                                        })}
                                    </small>
                                    <small>p</small>
                                </div>
                                <div className='flex flex-col'>
                                    <small className='text-[10px] font-bold line-clamp-1'>{r.duty}</small>
                                    <small className='text-[10px]'>{r.shift}</small>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}
