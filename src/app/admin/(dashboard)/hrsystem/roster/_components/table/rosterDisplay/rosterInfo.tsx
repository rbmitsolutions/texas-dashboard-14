import { UseMutateFunction } from "react-query"

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import RosterTasksDisplay from "../rosterTasksDisplay"
import AddTaskToRoster from "../addTaskToRoster"
import { Button } from "@/components/ui/button"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import { IRoster } from "@/common/types/company/roster.interface"
import { IForm } from "@/common/types/company/form.interface"


interface RosterInfoProps {
    forms: IForm[]
    roster: IRoster
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function RosterInfo({ roster, forms, createRosterTask, deleteRosterTask, updateRoster }: RosterInfoProps): JSX.Element {
    const handleUpdateRoster = async () => {
        await updateRoster({
            roster: {
                one: {
                    id: roster?.id,
                    duty: "Sick Day",
                    shift: "Day Off",
                    status: "sickday",
                    break_in: null,
                    break_out: null,
                    clock_in: null,
                    clock_out: null,
                    forgot_to_clock_out: false,
                    hours_roster: 0,
                    week_payment_roster: 0,
                    confirmed: true,
                    available: true,
                }
            }
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='h-4 w-4 p-1' variant='secondary'>
                    <Icon name='FileBadge2' size={8} />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
                <SheetHeader>
                    <SheetTitle>Roster - {formatDate({
                        date: new Date(roster?.date!),
                        f: 'dd/MM/yyyy'
                    })}</SheetTitle>
                </SheetHeader>
                <div className='flex-col-container overflow-auto scrollbar-thin'>
                    <Button className='w-full h-12' variant='green'>
                        Clock In - {roster?.clock_in && formatDate({
                            date: new Date(roster?.clock_in),
                            f: 'HH:mm:ss'
                        })}
                    </Button>
                    <Button className='w-full h-12' variant='orange'>
                        Break In - {roster?.break_in && formatDate({
                            date: new Date(roster?.break_in),
                            f: 'HH:mm:ss'
                        })}
                    </Button>
                    <Button className='w-full h-12' variant='yellow'>
                        Break Out - {roster?.break_out && formatDate({
                            date: new Date(roster?.break_out),
                            f: 'HH:mm:ss'
                        })}
                    </Button>
                    <Button className='w-full h-12' variant='destructive'>
                        Clock Out - {roster?.clock_out && formatDate({
                            date: new Date(roster?.clock_out),
                            f: 'HH:mm:ss'
                        })}
                    </Button>

                    <div>
                        <strong className='mr-2'>Tasks</strong>
                        <AddTaskToRoster
                            createRosterTask={createRosterTask}
                            forms={forms}
                            roster_id={roster?.id}
                        />
                    </div>
                    {roster?.tasks?.map(t => {
                        return (
                            <RosterTasksDisplay
                                key={t?.id} 
                                task={t}
                                deleteRosterTask={deleteRosterTask}
                            />
                        )
                    })}
                </div>
                <SheetFooter>
                    <Button
                        className='w-full h-12'
                        variant='purple'
                        leftIcon="Stethoscope"
                        disabled={roster?.status === 'dayoff' || roster?.status === 'holiday' || roster?.status === 'sickday'}
                        onClick={handleUpdateRoster}
                    >
                        Update to Sick Day
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}