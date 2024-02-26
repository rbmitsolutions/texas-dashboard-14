import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { Permissions } from "@/common/types/auth/auth.interface"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthHooks } from "@/hooks/useAuthHooks"
import { SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const navigation = [
    {
        title: 'Company',
        path: '/admin/settings/company/details'
    },
    {
        title: 'Hr System',
        path: '/admin/settings/hrsystem/departments'
    },
    {
        title: 'Restaurant',
        path: '/admin/settings/restaurant/sections'
    },
    {
        title: 'Bookings',
        path: '/admin/settings/bookings/timesopen'
    },
    {
        title: 'Apis',
        path: '/admin/settings/apis/email'
    },
    {
        title: 'History',
        path: '/admin/settings/history'
    },
]

export default function Settings() {
    const { user } = useAuthHooks()
    const { push } = useRouter()

    if (!isUserAuthorized(user, [Permissions.ADMIN])) return

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SettingsIcon className="absolute h-[1rem] w-[1rem] text-foreground" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {navigation?.map(nav => {
                    return (
                        <DropdownMenuItem key={nav.path} onClick={() => push(nav.path)}>
                            {nav.title}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}