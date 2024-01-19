'use strict'
import { useRouter } from "next/navigation";

//components
import Icon from "@/common/libs/lucida-icon";
import { Button } from "@/components/ui/button";
import { destroyCookie } from "nookies";

export default function SignOut() {
    const router = useRouter();
    const handleSingOut = async () => {
        await destroyCookie({}, process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string, {
            path: "/",
        });
        router.push("/signin");
    };

    return (
        <Button
            size='icon'
            variant='destructive'
            className='h-8 w-8'
            onClick={handleSingOut}
        >
            <Icon name='LogOut' size={14} />
        </Button>
    )
}