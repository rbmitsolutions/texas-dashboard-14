import { Dispatch, SetStateAction } from "react"
import { UseMutateFunction } from "react-query"

//components
import SearchInput from "@/components/common/searchInput"
import LinkButton from "@/components/common/linkButton"
import SendEmail from "@/components/common/sendEmail"
import SendSms from "@/components/common/sendSms"
import InfoBox from "@/components/common/infoBox"
import SendRoster from "./sendRoster"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//hooks
import { IGETCompanyDataQuery, IRosterPageResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"
import ExcelDownloadButton from "@/components/common/excelDownloadButton"


interface RosterHeaderProps {
    payments_data: IRosterPageResponse['payments_data']
    users: IRosterPageResponse['users']
    isLoading: boolean
    error: boolean
    setUsers: Dispatch<SetStateAction<IGETCompanyDataQuery>>
    usersParams: IGETCompanyDataQuery
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export default function RosterHeader({ payments_data, isLoading, error, setUsers, users, usersParams, updateRoster }: RosterHeaderProps): JSX.Element {

    const rosterDownload = async (): Promise<any[] | undefined> => {
        const data = users?.map(user => {
            let object: any = {
                Name: user?.name,
                Mon: '',
                Tue: '',
                Wed: '',
                Thu: '',
                Fri: '',
                Sat: '',
                Sun: '',
                'Scheduled Hours': user?.preview_hours,
                'Scheduled Payments': user?.preview_roster,
                'Actual Hours': user?.roster_hours,
                'Actual Payments': user?.total_roster
            }

            user?.roster?.forEach(r => {
                if (r?.week_day) {
                    object[r.week_day as any] = `${r?.duty} / ${r?.shift}`
                }
            })

            return object

        })
        return data
    }

    return (
        <header className='flex-col-container'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
                <InfoBox
                    icon={{ name: 'Banknote' }}
                    title="Payment Preview"
                    value={convertCentsToEuro((payments_data?.total_preview * 100) || 0)}
                    isLoading={isLoading}
                    error={error} />
                <InfoBox
                    icon={{ name: 'BadgeEuro' }}
                    title="Available Payment"
                    value={convertCentsToEuro((payments_data?.total_available * 100) || 0)}
                    isLoading={isLoading}
                    error={error} />
                <InfoBox
                    icon={{ name: 'Timer' }}
                    title="Clock in / out"
                    value={convertCentsToEuro((payments_data?.total_roster * 100) || 0)}
                    isLoading={isLoading}
                    error={error} />
                <InfoBox
                    icon={{
                        name: payments_data?.total_diff > 0 ? 'ArrowUp' : 'ArrowDown',
                        className: payments_data?.total_diff > 0 ? 'text-red-600' : 'text-green-600'
                    }}
                    title="Difference"
                    value={convertCentsToEuro((payments_data?.total_diff * 100) || 0)}
                    isLoading={isLoading}
                    error={error} />
            </div>
            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[1fr,auto]'>
                <SearchInput
                    value={usersParams?.roster?.rosterPage?.name || ''}
                    onSearchChange={e => setUsers(prev => ({
                        roster: {
                            rosterPage: {
                                ...prev?.roster?.rosterPage,
                                name: e,
                                date: {
                                    gte: prev?.roster?.rosterPage?.date?.gte!,
                                    lte: prev?.roster?.rosterPage?.date?.lte!
                                }
                            }
                        }
                    }))}
                    custom="max-w-lg"
                />
                <div className='flex gap-2 items-center'>
                    <ExcelDownloadButton
                        fileName="Roster"
                        onDownload={async () => await rosterDownload()}
                    />
                    <SendEmail
                        contacts={users?.filter(u => {
                            return {
                                id: u?.id,
                                name: u?.name,
                                email: u?.email
                            }
                        })}
                    />
                    <SendSms
                        contacts={users?.map(u => {
                            return {
                                id: u?.id,
                                name: u?.name,
                                contact_number: u?.contact_number || ''
                            }
                        }).filter(u => u.contact_number)}
                    />
                    <LinkButton
                        href='/admin/hrsystem/payments/roster'
                        icon='Euro'
                    />
                    <SendRoster
                        usersParams={usersParams}
                        updateRoster={updateRoster}
                    />
                </div>
            </div>
        </header>
    )
}