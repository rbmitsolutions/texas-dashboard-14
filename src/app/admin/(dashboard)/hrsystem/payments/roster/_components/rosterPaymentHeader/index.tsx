import { Dispatch, SetStateAction, useRef, useState } from "react"
import { UseMutateFunction } from "react-query";
import { CSVLink } from "react-csv";

//components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import SearchInput from "@/components/common/searchInput"
import InfoBox from "@/components/common/infoBox"
import { Button } from "@/components/ui/button"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//interfaces
import { PayrollTransactionsType } from "@/common/types/company/transactions.interface"
import { IGETCompanyDataQuery, IUserExtraPaymentData } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn, IPOSTTransaction } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";

interface RosterPaymentHeaderProps {
    transactions: IPOSTTransaction[]
    setTransactions: Dispatch<SetStateAction<IPOSTTransaction[]>>
    users: IUserExtraPaymentData[],
    setUsersParams: Dispatch<SetStateAction<IGETCompanyDataQuery>>
    usersParams: IGETCompanyDataQuery
    createTransactions: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    isCreateTransactionsLoading: boolean
    updateRoster: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export default function RosterPaymentHeader({ transactions, setTransactions, users, setUsersParams, usersParams, createTransactions, isCreateTransactionsLoading, updateRoster }: RosterPaymentHeaderProps): JSX.Element {
    const [csvDownload, setCsvDownload] = useState<any[]>([]);
    const csvRef = useRef(null);

    const total = transactions.reduce((acc, t) => {
        acc += t.total
        return acc
    }, 0)


    const handleCreatePayments = async () => {
        const payments = users?.map((user) => {
            const payments = transactions?.filter((p) => p.payee_key === user?.id);
            const p = Object.values(PayrollTransactionsType).map((option) => {
                const c = payments?.find((p) => p.type === option)?.total
                return {
                    [option.split(" ").join("_")]: c ? c / 100 : 0
                };
            });

            const testObj = Object.assign({}, ...p);
            return {
                name: user.name,
                payment_id: user?.payment_id,
                preview_hours: user?.preview_hours,
                roster_hours: user?.roster_hours,
                preview_payment: user.preview_roster,
                ...testObj,
                total: payments?.reduce((a, b) => a + b.total, 0) / 100 || 0,
            };
        });

        setCsvDownload(payments);

        await createTransactions({
            transaction: {
                many: transactions?.filter(t => t.total > 0)
            }
        }, {
            onSuccess: () => {
                setTransactions([]);
                (csvRef.current as any)?.link?.click();
            }
        });

        await updateRoster({
            roster: {
                many: {
                    between: {
                        gte: usersParams?.roster?.rosterPayment?.date?.gte!,
                        lte: usersParams?.roster?.rosterPayment?.date?.lte!
                    },
                    paid: true
                }
            }
        })
    }

    console.log(csvDownload)
    return (
        <div className='flex-col-container'>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4'>
                {Object.values(PayrollTransactionsType).map(type => {
                    const totalByType = transactions.reduce((acc, t) => {
                        if (t.type === type) {
                            acc += t.total
                        }
                        return acc
                    }, 0)
                    return (
                        <InfoBox
                            key={type}
                            icon={{ name: 'Banknote' }}
                            title={type}
                            value={convertCentsToEuro(totalByType)}
                        />
                    )
                })}
                <InfoBox
                    icon={{ name: 'Banknote' }}
                    title='Total'
                    value={convertCentsToEuro(total)}
                />
            </div>
            <div className='flex justify-between p-4 gap-4 bg-background-soft rounded-xl'>
                <SearchInput
                    placeholder='Search by name'
                    value={usersParams?.roster?.rosterPayment?.name || ''}
                    onSearchChange={e => setUsersParams(prev => ({
                        roster: {
                            rosterPayment: {
                                ...prev.roster?.rosterPayment,
                                date: {
                                    gte: prev.roster?.rosterPayment?.date?.gte!,
                                    lte: prev.roster?.rosterPayment?.date?.lte!
                                },
                                name: e
                            }
                        }
                    }))}
                />
                <div className='none'>
                    <CSVLink
                        ref={csvRef}
                        data={csvDownload}
                        filename={`${formatDate({
                            date: usersParams?.roster?.rosterPayment?.date?.gte!,
                            f: 'dd/MM/yyyy'
                        })} - ${formatDate({
                            date: usersParams?.roster?.rosterPayment?.date?.lte!,
                            f: 'dd/MM/yyyy'
                        })} `}
                    />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button leftIcon="Banknote" isLoading={isCreateTransactionsLoading}>
                            Pay
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                        <Button
                            leftIcon="Banknote"
                            variant='green'
                            onClick={handleCreatePayments}
                        >
                            Create Payments
                        </Button>

                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}