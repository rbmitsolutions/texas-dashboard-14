import { UseMutateFunction } from "react-query";

//components
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { IRequests } from "@/common/types/company/requests.interface";
import InfoBadge from "@/components/common/infoBadge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/common/libs/lucida-icon";

//hooks
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";

interface RequestComponentProps {
    request: IRequests
    isDeleteRequestLoading: boolean
    deleteRequest: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function RequestComponent({ request, deleteRequest, isDeleteRequestLoading }: RequestComponentProps) {
    const requestBeDeleted = request?.status === "Waiting" ? false : true

    const handleDeleteRequest = async () => {
        await deleteRequest({
            request: {
                id: request?.id
            }
        })
    }

    return (
        <div className='flex-col-container border-2 p-4 rounded-xl hover:bg-foreground/5'>
            <div className='flex-container justify-between'>
                <div className='flex-container-center'>
                    <Icon name='CalendarDays' size={14} />
                    <h3>{formatDate({
                        date: request?.created_at,
                        f: 'dd/MM/yyyy'
                    })}</h3>
                </div>
                <div className='flex-container-center gap-4'>
                    <InfoBadge status={request?.status} />
                    <Button
                        size='iconSm'
                        variant='destructive'
                        disabled={requestBeDeleted}
                        onClick={handleDeleteRequest}
                        isLoading={isDeleteRequestLoading}
                    >
                        <Icon name='Trash' size={14} />
                    </Button>
                </div>
            </div>
            <h5>{request?.type}</h5>

            <div className='flex flex-wrap gap-2'>
                {request?.type !== 'Message' &&
                    <>
                        {request?.type === 'Day Off' ?
                            request?.dates_off?.map(d => {
                                return (
                                    <Badge key={d}>
                                        {formatDate({
                                            date: new Date(d),
                                            f: 'dd/MM/yyyy'
                                        })}
                                    </Badge>
                                )
                            })
                            :
                            <div>
                                <div>
                                    <small>From : </small>
                                    <Badge>
                                        {formatDate({
                                            date: new Date(request?.dates_off[0]),
                                            f: 'dd/MM/yyyy'
                                        })}
                                    </Badge>
                                </div>
                                <div className='mt-2'>
                                    <small>To : </small>
                                    <Badge>
                                        {formatDate({
                                            date: new Date(request?.dates_off[0]),
                                            f: 'dd/MM/yyyy'
                                        })}
                                    </Badge>
                                </div>
                            </div>
                        }
                    </>
                }
            </div>
            {request?.message &&
                <>
                    <small>Message</small>
                    <Textarea
                        readOnly
                        value={request?.message}
                        className='h-32'
                    />
                </>
            }
            {request?.answer &&
                <>
                    <small>Answer</small>
                    <Textarea
                        readOnly
                        value={request?.answer}
                        className='h-32'
                    />
                </>
            }
        </div>
    )
}   