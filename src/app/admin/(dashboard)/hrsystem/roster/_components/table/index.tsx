import { UseMutateFunction } from "react-query";
import { memo, useEffect, useState } from "react";

//libs
import { formatDate, getEachDayOfInterval } from "@/common/libs/date-fns/dateFormat";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon";

//components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LinkButton from "@/components/common/linkButton";
import SendEmail from "@/components/common/sendEmail";
import SendSms from "@/components/common/sendSms";
import { Badge } from "@/components/ui/badge";
import RosterDisplay from "./rosterDisplay";
import AddToRoster from "./addToRoster";

//hooks
import { IGETCompanyDataQuery, IRosterPageResponse } from "@/hooks/company/IGetCompanyDataHooks.interface";
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";

//interface
import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface";
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";
import { RedirectTo } from "@/common/types/routers/endPoints.types";
import { IForm } from "@/common/types/company/form.interface";
import UserDisplay from "@/components/common/userDisplay";

export type IWeekDays = { date: string; day: string; }[]

interface RosterTableProps {
    users: IRosterPageResponse['users']
    duties: IDuties[],
    shifts: IShifts[],
    forms: IForm[]
    params: IGETCompanyDataQuery
    createRoster: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    deleteRoster: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    deleteRosterTask: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
}
const getWeekdaysBetweenDates = (startDate: Date, endDate: Date) => {
    const days = getEachDayOfInterval(startDate, endDate);
    return days.map(day => ({
        date: formatDate({
            date: day,
            f: 'dd/MM/yy'
        }),
        day: formatDate({
            date: day,
            f: 'EEE'
        })
    }));
};

const styles = {
    th: 'min-w-28 max-w-28 text-[8px] p-1 text-center',
    td: 'text-[10px] p-1 text-center'
}

export function RosterTableMemo({ users, duties, shifts, forms, createRosterTask, deleteRoster, deleteRosterTask, createRoster, updateRoster, params }: RosterTableProps): JSX.Element {
    const [weekDays, setWeekDays] = useState<IWeekDays>([])

    useEffect(() => {
        setWeekDays(getWeekdaysBetweenDates(params?.roster?.rosterPage?.date?.gte!, params?.roster?.rosterPage?.date?.lte!))
    }, [params])

    return (
        <table className='bg-slate-100 dark:bg-slate-900'>
            <thead>
                <tr>
                    <th className={cn(styles.th, 'min-w-36 max-w-36 w-full text-left')}>
                        Employee
                    </th>
                    {weekDays?.map((date) => {
                        return (
                            <th key={date?.date} className='min-w-[135px] max-w-[135px] p-1'>
                                <div className='flex items-end justify-center'>
                                    <strong className='text-[10px] text-primary'>{date?.day}</strong>
                                    <small className='text-[8px] text-foreground/40 ml-1'>{date?.date}</small>
                                </div>
                            </th>
                        )
                    })}
                    <th className={cn(styles.th, 'min-w-16 max-w-16')}>
                        Scheduled Hours
                    </th>
                    <th className={cn(styles.th, 'min-w-16 max-w-16')}>
                        Scheduled Payments
                    </th>
                    <th className={cn(styles.th, 'min-w-16 max-w-16')}>
                        Actual Hours
                    </th>
                    <th className={cn(styles.th, 'min-w-20 max-w-20')}>
                        Actual Payments
                    </th>
                </tr>
            </thead>
            <tbody>
                {users?.map(user => {
                    return (
                        <tr
                            key={user?.id}
                            className={cn('h-20 border-b-[1px] border-foreground/20 odd:bg-background-soft', user?.status === 'Filled' && ' !bg-red-100 dark:!bg-red-900/20')}
                        >
                            <td>
                                <div className='flex flex-col p-1'>
                                    <div className='flex items-center gap-2'>
                                        <UserDisplay
                                            user={{
                                                name: user?.name || '',
                                                profile_image: user?.profile_image as string
                                            }}
                                            displayClass="h-7 w-7"
                                            titleClass="text-[12px] font-bold"
                                        />
                                    </div>
                                    <div className='flex items-center gap-1 mt-2'>
                                        <AddToRoster
                                            user={user}
                                            weekDays={weekDays}
                                            shifts={shifts}
                                            duties={duties}
                                            createRoster={createRoster}
                                            deleteRoster={deleteRoster}
                                            createRosterTask={createRosterTask}
                                            forms={forms}
                                            deleteRosterTask={deleteRosterTask}
                                        />
                                        <SendEmail
                                            contacts={[{
                                                id: user?.id,
                                                name: user?.name,
                                                email: user?.email
                                            }]}
                                            size='iconExSm'
                                        />
                                        <SendSms
                                            contacts={[{
                                                id: user?.id,
                                                name: user?.name,
                                                contact_number: user?.contact_number || ''
                                            }]}
                                            size='iconExSm'
                                        />
                                        <LinkButton
                                            href={`${RedirectTo.USER_PROFILE}/${user?.id}`}
                                            className="h-6 w-6 bg-background text-black dark:text-white hover:bg-foreground/10"
                                        />
                                    </div>
                                </div>
                            </td>
                            {weekDays?.map((date) => {
                                const available = user?.available_days?.find(day => day?.weekDay === date?.day)
                                return (
                                    <td key={date?.date} className='h-20'>
                                        <RosterDisplay
                                            forms={forms}
                                            updateRoster={updateRoster}
                                            deleteRoster={deleteRoster}
                                            createRosterTask={createRosterTask}
                                            deleteRosterTask={deleteRosterTask}
                                            roster={user?.roster?.filter(
                                                (x) => x.week_day === date?.day
                                            ) || []}
                                            available={available}
                                        />
                                    </td>
                                );
                            })}
                            <td className={styles?.td}>
                                {user?.preview_hours}
                            </td>
                            <td className={styles?.td}>
                                {convertCentsToEuro(user?.preview_roster * 100)}
                            </td>
                            <td className={styles?.td}>
                                {user?.roster_hours}
                            </td>
                            <td className={styles?.td}>
                                <div className='flex flex-col items-center gap-2'>
                                    <small className='text-xs'>{convertCentsToEuro(user?.total_roster * 100)}</small>
                                    <Badge className={cn('flex gap-1 text-[8px] font-bold text-white',
                                        user?.preview_roster < user?.total_roster ? 'bg-red-800 hover:bg-red-900' : 'bg-green-800 hover:bg-green-900')}>
                                        <Icon name={user?.preview_roster < user?.total_roster ? 'ThumbsDown' : 'ThumbsUp'} size={10} />
                                        {user?.preview_roster > user?.total_roster ? '-' : '+'}{convertCentsToEuro(user?.diff_roster * 100)}
                                    </Badge>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export const RosterTable = memo(RosterTableMemo);