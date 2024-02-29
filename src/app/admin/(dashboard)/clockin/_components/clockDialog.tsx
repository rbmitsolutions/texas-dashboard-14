import toast from "react-hot-toast";

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { api } from "@/common/libs/axios/api";

//components
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IRoster } from "@/common/types/company/roster.interface";
import { Button } from "@/components/ui/button";

//interfaces
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

interface ClockDialogProps {
    roster: IRoster
    onClose: () => void
    isOpen: boolean
    isLoading: boolean
}

const buttonStyle = 'w-full h-14'

export default function ClockDialog({ roster, onClose, isOpen, isLoading }: ClockDialogProps): JSX.Element {

    const updateRosterUser = async (param: string, roster: IRoster) => {
        let obj = {} as any;
        if (param === "clock_out") {
            if (roster.break_in && !roster.break_out) {
                obj = {
                    clock_out: new Date(),
                    break_out: new Date(),
                };
            } else {
                obj[param] = new Date();
            }
        } else {
            obj[param] = new Date();
        }

        await api
            .put(`${EndPointsTypes['APP_CLOCKIN_ENDPOINT']}?id=${roster?.id}`, obj)
            .then(() => {
                toast.success('Thank you')
            })
            .catch((err) => {
                toast.error('Something went wrong')
                throw err;
            })
            .finally(() => {
                onClose()
            });
    };


    return (
        <Dialog
            open={roster && isOpen ? true : false}
            onOpenChange={onClose}
        >
            <DialogContent className="sm:max-w-[425px]">
                <div className='flex-col-container-center p-4'>
                    <Avatar className='h-20 w-20 relative'>
                        <AvatarImage src={roster?.user?.profile_image} alt={roster?.user?.name} />
                        <AvatarFallback className="hover:bg-slate-800">
                            <p className='text-2xl group-hover:hidden'>
                                {roster?.user && roster?.user?.name?.split('')[0]}
                            </p>
                        </AvatarFallback>
                    </Avatar>
                    <h1>{roster?.user?.name}</h1>
                    <Button
                        isLoading={isLoading}
                        variant='green'
                        disabled={roster?.clock_in !== null}
                        className={buttonStyle}
                        onClick={() => updateRosterUser("clock_in", roster)}
                    >
                        {roster?.clock_in
                            ? formatDate({
                                date: new Date(roster?.clock_in),
                                f: "HH:mm:ss"
                            })
                            : "Clock in"}
                    </Button>

                    <Button
                        isLoading={isLoading}
                        className={buttonStyle}
                        variant='orange'
                        disabled={
                            roster?.clock_in === null ||
                            roster?.break_in !== null ||
                            roster?.clock_out !== null
                        }
                        onClick={() => updateRosterUser("break_in", roster)}
                    >
                        {roster?.break_in
                            ? formatDate({
                                date: new Date(roster?.break_in),
                                f: "HH:mm:ss"
                            })
                            : "Break Start"}
                    </Button>

                    <Button
                        isLoading={isLoading}
                        className={buttonStyle}
                        variant='yellow'
                        disabled={
                            roster?.clock_in === null ||
                            roster?.break_in === null ||
                            roster?.break_out !== null
                        }
                        onClick={() => updateRosterUser("break_out", roster)}
                    >
                        {roster?.break_out
                            ? formatDate({
                                date: new Date(roster?.break_out),
                                f: "HH:mm:ss"
                            })
                            : "Break Finished"}
                    </Button>

                    <Button
                        isLoading={isLoading}
                        className={buttonStyle}
                        variant='destructive'
                        disabled={
                            roster?.clock_in === null || (roster?.clock_out && true)
                        }
                        onClick={() => updateRosterUser("clock_out", roster)}
                    >
                        {roster?.clock_out
                            ? formatDate({
                                date: new Date(roster?.clock_out),
                                f: "HH:mm:ss"
                            })
                            : "Clock Out"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}