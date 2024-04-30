'use client'
import Link from "next/link"

//utils
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import { smsColumnsTable } from "./_components/smsColumnsTable"
import { BasicTable } from "@/components/common/basicTable"
import InfoBox from "@/components/common/infoBox"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

export default function Sms() {

    const {
        serviceSMSApi: smsApi
    } = useGETCompanyDataHooks({
        query: 'SMS',
        defaultParams: {
            sms: {
                api: '1'
            }
        }
    })


    return (
        <div>
            <div className='flex-container justify-center items-center gap-8 py-10'>
                <div
                    className='flex-col-container gap-2 items-center justify-center '
                >
                    <h1 className='font-bold text-4xl'>Sms To</h1>
                    <Link href='https://sms.to/' className='text-blue-600'
                        target='_blank' rel='noreferrer'
                    >https://sms.to/</Link>
                </div>
                <InfoBox 
                    icon={{
                        name: 'Euro',
                    }}
                    title="Balance"
                    value={convertCentsToEuro(smsApi?.balance?.balance * 100 || 0)}
                />
            </div>
            <Wrap
                header={{
                    title: {
                        icon: 'Phone',
                        title: 'Last 15 messages'
                    }
                }}
            >
                <BasicTable
                    columns={smsColumnsTable({})}
                    data={smsApi?.messages || []}
                />
            </Wrap>
        </div>
    )
}