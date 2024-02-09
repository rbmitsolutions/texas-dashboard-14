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
                <div className='flex gap-2'>
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