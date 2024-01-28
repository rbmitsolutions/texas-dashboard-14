'use client'
import { addDaysToDate, getFirstTimeOfTheDay, getLastTimeOfTheDay } from '@/common/libs/date-fns/dateFormat';

//components
import { usePUTCompanyDataHooks } from '@/hooks/company/companyDataHooks';
import RosterComponent from './_components/rosterComponent';
import Wrap from '@/components/common/wrap';
import { ROSTER_CONFIG, rosterBackground } from '@/common/libs/company/roster';
import { IRosterStatus } from '@/common/types/company/roster.interface';
import { cn } from '@/common/libs/shadcn/utils';
import { useGETUserDataHooks, usePUTUserDataHooks } from '@/hooks/user/useUserDataHooks';


export default function Roster() {
    const {
        userAllRoster: roster,
        setGETUserDataParams: setGETRoster,
        GETUserDataParams: GETRoster,
        refetchUserData: refetchRoster,
    } = useGETUserDataHooks({
        query: 'USER_ROSTER',
        defaultParams: {
            roster: {
                all: {
                    date: {
                        gte: new Date(),
                        lte: getLastTimeOfTheDay(addDaysToDate(new Date(), 7))
                    },
                    pagination: {
                        take: 60,
                        skip: 0
                    },
                    user_id: ''
                }
            }
        },
    })

    const { updateuserData: updateRoster } = usePUTUserDataHooks({
        query: 'USER_ROSTER',
        toRefetch: refetchRoster
    })


    return (
        <Wrap
            header={{
                title: {
                    title: 'Roster',
                    icon: 'CalendarDays'
                }
            }}
            actions={{
                toLeft: (
                    <div className='flex flex-wrap gap-4'>
                        {Object.keys(ROSTER_CONFIG).map((status) => {
                            return (
                                <div
                                    key={status}
                                    className='flex-container'
                                >
                                    <div
                                        className={cn('w-4 h-4 rounded-full', rosterBackground(status as IRosterStatus, true))}
                                    />
                                    <span
                                        className='text-xs capitalize'
                                    >
                                        {ROSTER_CONFIG[status as IRosterStatus].title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ),
                dateChange: {
                    datePickerWithRange: {
                        onConfirm: (data) => {
                            setGETRoster(prev => ({
                                roster: {
                                    all: {
                                        ...prev?.roster?.all,
                                        date: {
                                            gte: getFirstTimeOfTheDay(new Date(data?.from!)),
                                            lte: getLastTimeOfTheDay(new Date(data?.to!))
                                        },
                                        user_id: ''
                                    },
                                }
                            }))
                        },
                        max: 30,
                        value: {
                            from: GETRoster?.roster?.all?.date?.gte,
                            to: GETRoster?.roster?.all?.date?.lte
                        }
                    },
                },
                className: 'grid grid-cols-1 gap-4 items-center lg:grid-cols-[1fr,250px]'
            }}
        >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {roster?.data?.map(r => {
                    return <RosterComponent
                        key={r?.id}
                        roster={r}
                        updateRoster={updateRoster}
                    />
                })}
            </div >
        </Wrap>
    )
}