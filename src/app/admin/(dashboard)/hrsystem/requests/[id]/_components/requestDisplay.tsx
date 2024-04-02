'use client'
import { cn } from "@/common/libs/shadcn/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

//components
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import LinkButton from "@/components/common/linkButton"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { ImagesPath } from "@/common/types/imgs"
import Wrap from "@/components/common/wrap"
import { Label } from "@/components/ui/label"

//hooks
import { usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interface
import { IRequests, IRequestsStatus } from "@/common/types/company/requests.interface"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

interface RequestDisplayProps {
    request: IRequests
}

export default function RequestDisplay({ request }: RequestDisplayProps): JSX.Element {
    const router = useRouter()
    const [answer, setAnswer] = useState<string>("")

    const {
        updateCompanyData: updateRequest,
        isUpdateCompanyDataLoading: isLoading
    } = usePUTCompanyDataHooks({
        query: "REQUESTS",
    })

    const renderDaysOff = (type: string, dates: string[]) => {
        if (type === 'Day Off') {
            return dates.map((date) => {
                return (
                    <Badge className='flex items-center justify-center' key={date}>{formatDate({
                        date: new Date(date) || new Date(),
                        f: 'dd/MM/yyyy'
                    })}</Badge>
                )
            })
        } else {
            return (
                <>
                    <Badge className='flex items-center justify-center'>From: {formatDate({
                        date: new Date(dates[0]) || new Date(),
                        f: 'dd/MM/yyyy'
                    })}</Badge>
                    <Badge className='flex items-center justify-center'>To: {formatDate({
                        date: new Date(dates[1]) || new Date(),
                        f: 'dd/MM/yyyy'
                    })}</Badge>
                </>
            )
        }
    }

    const onSubmit = async (status: IRequestsStatus, requestId: string) => {
        await updateRequest({
            request: {
                id: requestId,
                status,
                answer
            }
        }, {
            onSettled: () => {
                router.back()
            }
        })
    }

    console.log(request?.dates_off)
    return (
        <div className='flex-col-container-center'>
            <div className={cn('h-80 w-full rounded-2xl bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:grayscale ',)} />
            <Wrap
                header={{
                    title: {
                        title: request?.type || 'Request',
                        icon: 'MessageCircleMore'
                    }

                }}
                className='p-4 mt-[-200px] w-full max-w-[85vw] z-10 rounded-xl bg-background shadow-xl md:max-w-[450px]  border-[1px]'
            >
                <div className='flex justify-between'>
                    <div className='flex-container-center'>
                        <Image
                            alt={`menu-${request?.user?.name} thumbnail`}
                            src={request?.user?.profile_image || ImagesPath['NO_IMAGE']}
                            width={40}
                            height={40}
                            className={cn('rounded-md', !request?.user?.profile_image && 'grayscale opacity-20')}
                        />
                        <strong>{request?.user?.name}</strong>
                    </div>
                    <LinkButton href={`${RedirectTo.USER_PROFILE}/${request?.user_id}`} />
                </div>
                <div className='flex-col-container mt-4'>
                    {(request?.type !== "Message" &&  request?.dates_off?.length > 1) && (
                        <div
                            className='flex-col-container-center w-full my-2'
                        >
                            {renderDaysOff(request?.type, request?.dates_off)}
                        </div>
                    )}
                    {request?.message && (
                        <div >
                            <Label>{request?.user?.name}</Label>
                            <Textarea
                                className='h-40 resize-none mt-2'
                                placeholder="Leave him a message !"
                                readOnly
                                value={request?.message}
                            />
                        </div >
                    )}
                    <div>
                        <Label>Answer</Label>
                        <Textarea
                            className='h-40 resize-none  mt-2'
                            placeholder="Leave him a message !"
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-4'>
                    <Button
                        variant='destructive'
                        leftIcon='ThumbsDown'
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={() => onSubmit(IRequestsStatus.Denied, request?.id)}
                    >
                        Decline
                    </Button>
                    <Button
                        variant='green'
                        leftIcon='ThumbsUp'
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={() => onSubmit(IRequestsStatus.Approved, request?.id)}
                    >
                        Aprove
                    </Button>
                </div>
            </Wrap>
        </div>
    )
}