'use client'
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//libs
import { api } from "@/common/libs/axios/api";

//components
import { KeyPadDisplay } from "@/components/common/keyPadDisplay";
import ClockDialog from "./_components/clockDialog";

//interface
import { IRoster } from "@/common/types/company/roster.interface";
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

export default function ClockInPage() {
    const [password, setPassword] = useState<number[]>([]);
    const [roster, setRoster] = useState<IRoster | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onClose = () => {
        setIsOpen(false)
        setPassword([])
        setRoster(null)
    }

    const handleValueChange = (e: number, remove?: boolean) => {
        if (remove) {
            setPassword((prevValue) => prevValue.slice(0, -1));
        } else {
            if (password?.length === 5) {
                return;
            }
            setPassword((prevValue) => [...prevValue, e]);
        }
    }

    const getRoster = async (password: string) => {
        setIsLoading(true);
        try {
            const data = await api.get(`${EndPointsTypes['APP_CLOCKIN_ENDPOINT']}?roster_password=${password}`)
            setRoster(data.data)
            setIsOpen(true)
        } catch (err) {
            toast.error('Invalid password');
        } finally {
            setPassword([]);
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if (password.length === 5) {
            setIsLoading(true);
            getRoster(password.join(""));
        }
    }, [password]);

    return (
        <div className='flex-col-container-center justify-center min-h-[78vh]'>
            <h1 className='text-3xl font-bold'>Clock In</h1>
            <KeyPadDisplay
                displayValue={password?.join('')}
                onChange={handleValueChange}
                isDisabled={isLoading}
                isLoading={isLoading}
            />
            {roster &&
                <ClockDialog roster={roster} onClose={onClose} isOpen={isOpen} isLoading={isLoading} />
            }
        </div>
    )
}