import { IToken, Permissions } from "@/common/types/auth/auth.interface";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { KeyPadDisplay } from "../keyPadDisplay";
import { useEffect, useState } from "react";
import { useAuthHooks } from "@/hooks/useAuthHooks";
import { parseCookies, setCookie } from "nookies";
import { setAuthHeader } from "@/common/utils/tokens";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import toast from "react-hot-toast";
import { api } from "@/common/libs/axios/api";
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";


interface AuthModalPorps {
    handleAuthResponse: (user: IToken) => void
    toggleAuthDialog: () => void;
    isOpen: boolean;
    title?: string;
    permissions: Permissions[]
    save?: boolean
}

export default function AuthDialog({
    handleAuthResponse,
    toggleAuthDialog,
    isOpen,
    title,
    save = false,
    permissions
}: AuthModalPorps): JSX.Element {
    const { setUser } = useAuthHooks()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disableButtons, setDisabledButtons] = useState<boolean>(false);
    const [password, setPassword] = useState<number[]>([]);

    const onToggleDialog = () => {
        toggleAuthDialog();
        setPassword([]);
        setDisabledButtons(false);
    };

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

    const getUserFromCookies = async () => {
        const tokenKey: string = process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY! as string;
        const cookie = await parseCookies()

        let user: IToken | undefined

        if (cookie[tokenKey]) {
            user = JSON.parse(cookie[tokenKey])
        }

        if (user?.name && String(user?.roster_password) === password.join('')) {
            setAuthHeader(user.token);
            setUser(user);
            setIsLoading(false);
            onToggleDialog();

            if (!isUserAuthorized(user, permissions)) {
                return toast.error('You are not authorized')
            }

            await handleAuthResponse(user);
            return user
        }
    }

    const fetchUser = async (password: string) => {
        setIsLoading(true);
        const userFromCookies = await getUserFromCookies();

        if (userFromCookies) {
            return;
        }

        try {
            const { data: user } = await api.post<IToken>(
                `${EndPointsTypes['AUTH_ENDPOINT_SIGNIN']}/roster-password`, {
                data: {
                    byRosterPassword: {
                        roster_password: Number(password)
                    }
                }
            }
            );

            if (!isUserAuthorized(user, permissions)) {
                return toast.error('You are not authorized')
            }

            if (save) {
                await setCookie(
                    null,
                    process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string,
                    JSON.stringify(user),
                    {
                        maxAge: 24 * 60 * 60, //1day
                        path: "/",
                    }
                );
                setAuthHeader(user.token);
                setUser(user);
            }

            await handleAuthResponse(user);
        } catch (err) {
            toast.error('Invalid password');
        } finally {
            onToggleDialog()
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (password.length === 5) {
            setDisabledButtons(true);
            fetchUser(password.join(""));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password]);

    return (
        <Dialog open={isOpen} onOpenChange={onToggleDialog}>
            <DialogContent className="sm:max-w-[425px]">
                {title &&
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                }
                <div className="grid gap-4">
                    <KeyPadDisplay
                        displayValue={password?.join('')}
                        onChange={handleValueChange}
                        isDisabled={disableButtons}
                        isLoading={isLoading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}