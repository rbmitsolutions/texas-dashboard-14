import { UseMutateFunction } from "react-query"

//libs
import { rosterBackground } from "@/common/libs/company/roster"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"
import Icon from "@/common/libs/lucida-icon"
import { Button } from "@/components/ui/button"
import RosterInfo from "./rosterInfo"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import { IRoster } from "@/common/types/company/roster.interface"
import { IForm } from "@/common/types/company/form.interface"

interface RosterDisplayProps {
    forms: IForm[]
    roster: IRoster[]
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRoster: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export default function RosterDisplay({ roster, forms, createRosterTask, deleteRoster, deleteRosterTask, updateRoster }: RosterDisplayProps): JSX.Element {
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
                                    <div className='flex items-center gap-1'>
                                        <RosterInfo
                                            roster={r}
                                            updateRoster={updateRoster}
                                            forms={forms}
                                            createRosterTask={createRosterTask}
                                            deleteRosterTask={deleteRosterTask}
                                        />
                                        {!r?.available &&
                                            <>
                                                <Button
                                                    className='h-4 w-4 p-1'
                                                    variant='yellow'
                                                    onClick={async () => await updateRoster({
                                                        roster: {
                                                            one: {
                                                                id: r?.id,
                                                                available: true
                                                            }
                                                        }
                                                    })}
                                                >
                                                    <Icon name='Send' size={8} />
                                                </Button>
                                                <Button
                                                    className='h-4 w-4 p-1'
                                                    variant='destructive'
                                                    disabled={new Date(r?.date!) < new Date()}
                                                    onClick={async () => {
                                                        await deleteRoster({
                                                            roster: {
                                                                id: r?.id
                                                            }
                                                        })
                                                    }}
                                                >
                                                    <Icon name='X' size={8} />
                                                </Button>
                                            </>
                                        }
                                    </div>
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
