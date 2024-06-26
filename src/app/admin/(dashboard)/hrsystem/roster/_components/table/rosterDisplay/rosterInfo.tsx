import { UseMutateFunction } from "react-query"
import { cn } from "@/common/libs/shadcn/utils"

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import RosterTasksDisplay from "../rosterTasksDisplay"
import AddTaskToRoster from "../addTaskToRoster"
import { Button } from "@/components/ui/button"
import UpdateRoster from "./updateRoster"

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import Icon from "@/common/libs/lucida-icon"

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import { IRoster } from "@/common/types/company/roster.interface"
import { Permissions } from "@/common/types/auth/auth.interface"
import { IForm } from "@/common/types/company/form.interface"
import { IUser } from "@/common/types/user/user.interface"

interface RosterInfoProps {
    forms?: IForm[]
    roster: IRoster
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    createRosterTask?: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRosterTask?: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    shifts?: IShifts[]
    duties?: IDuties[]
    user?: IUser
    buttonClassName?: string
}

export default function RosterInfo({ roster, user, forms, shifts, duties, createRosterTask, deleteRosterTask, updateRoster, buttonClassName }: RosterInfoProps): JSX.Element {
    const { user: UserToken } = useAuthHooks()
    const handleUpdateRosterSickDay = async () => {
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

    const handleUpdateRosterDayInLieu = async (dayInLieu: boolean) => {
        await updateRoster({
            roster: {
                one: {
                    id: roster?.id,
                    day_in_lieu: dayInLieu,
                }
            }
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className={cn('h-4 w-4 p-1', buttonClassName)} variant='secondary'>
                    <Icon name='FileBadge2' />
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
                        Clock In - {(roster?.clock_in && !roster?.day_in_lieu) && formatDate({
                            date: new Date(roster?.clock_in),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </Button>
                    <Button className='w-full h-12' variant='orange'>
                        Break In - {(roster?.break_in && !roster?.day_in_lieu) && formatDate({
                            date: new Date(roster?.break_in),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </Button>
                    <Button className='w-full h-12' variant='yellow'>
                        Break Out - {(roster?.break_out && !roster?.day_in_lieu) && formatDate({
                            date: new Date(roster?.break_out),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </Button>
                    <Button className='w-full h-12' variant='destructive'>
                        Clock Out - {(roster?.clock_out && !roster?.day_in_lieu) && formatDate({
                            date: new Date(roster?.clock_out),
                            f: 'HH:mm:ss',
                            iso: false
                        })}
                    </Button>
                    {(shifts && duties && roster && user && isUserAuthorized(
                        UserToken,
                        [Permissions.ADMIN]
                    )) &&
                        <UpdateRoster
                            duties={duties}
                            shifts={shifts}
                            updateRoster={updateRoster}
                            user={user}
                            roster={roster}
                        />}
                    {(forms && createRosterTask) &&
                        <div>
                            <strong className='mr-2'>Tasks</strong>
                            <AddTaskToRoster
                                createRosterTask={createRosterTask}
                                forms={forms}
                                roster={roster}
                            />
                        </div>
                    }
                    {deleteRosterTask && roster?.tasks?.map(t => {
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
                    <div className='flex-col-container w-full'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className='w-full h-12'
                                    variant='pink'
                                    leftIcon="TentTree"
                                    disabled={!isUserAuthorized(
                                        UserToken,
                                        [Permissions.ADMIN])
                                        || roster?.day_in_lieu
                                    }

                                >
                                    {roster?.day_in_lieu ? 'Remove Day in Lieu' : 'Update to Day in Lieu'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            leftIcon='TentTree'
                                            onClick={() => {
                                                handleUpdateRosterDayInLieu(!roster?.day_in_lieu)
                                            }}
                                            disabled={roster?.day_in_lieu}
                                        >
                                            {roster?.day_in_lieu ? 'Remove Day in Lieu' : 'Day in Lieu'}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className='w-full h-12'
                                    variant='purple'
                                    leftIcon="Stethoscope"
                                    disabled={!isUserAuthorized(
                                        UserToken,
                                        [Permissions.ADMIN]
                                    ) || roster?.status === 'dayoff' || roster?.status === 'holiday' || roster?.status === 'sickday'}
                                >
                                    Update to Sick Day
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            leftIcon='Stethoscope'
                                            onClick={handleUpdateRosterSickDay}
                                        >
                                            Sick Day
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}