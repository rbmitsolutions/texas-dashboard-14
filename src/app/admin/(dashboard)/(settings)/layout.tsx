import SettingsNavigation from "@/components/common/settingsNavigation";

const companyComponents = [
    {
        title: "Details",
        href: "/admin/settings/company/details",
        description: "Update Company Details",
    },
    {
        title: 'Contacts',
        href: '/admin/settings/company/contacts',
        description: 'Update Company Contacts'
    },
    {
        title: 'Documents',
        href: '/admin/settings/company/documents',
        description: 'Update Company Documents'
    },
    {
        title: 'Links',
        href: '/admin/settings/company/links',
        description: 'Update Company Links'
    }
]

const hrsystemComponents = [
    {
        title: "Departments",
        href: "/admin/settings/hrsystem/departments",
        description: "Update Hr System Departaments",
    },
    {
        title: 'Roles',
        href: '/admin/settings/hrsystem/roles',
        description: 'Update Hr System Roles'
    },
    {
        title: 'Duties',
        href: '/admin/settings/hrsystem/duties',
        description: 'Update Hr System Duties'
    },
    {
        title: 'Shifts',
        href: '/admin/settings/hrsystem/shifts',
        description: 'Update Hr System Shifts'
    }
]

const restaurantComponents = [
    {
        title: "Sections",
        href: "/admin/settings/restaurant/sections",
        description: "Update Restaurant Sections Table",
    },
    {
        title: 'Tables',
        href: '/admin/settings/restaurant/tables',
        description: 'Update Restaurant tables'
    },
    {
        title: 'Auth Devices',
        href: '/admin/settings/restaurant/authdevices',
        description: 'Update Restaurant Auth Devices'
    },
    {
        title: 'Printers',
        href: '/admin/settings/restaurant/printers',
        description: 'Update Restaurant Printers'
    },
]

const bookingsComponents = [
    {
        title: "Open Days",
        href: "/admin/settings/bookings/opendays",
        description: "Update Restaurant Open Days",
    },
    {
        title: 'Special Days',
        href: '/admin/settings/bookings/specialdays',
        description: 'Update Restaurant Special Days'
    },
]
const apisComponents = [
    {
        title: "Email",
        href: "/admin/settings/apis/email",
        description: "Update Restaurant Email",
    },
    {
        title: "Sms",
        href: "/admin/settings/apis/sms",
        description: "Update Restaurant sms",
    },
    {
        title: "Images",
        href: "/admin/settings/apis/images",
        description: "Update Restaurant images",
    },
]



const navigation = [
    {
        title: 'Company',
        components: companyComponents
    },
    {
        title: 'Hr System',
        components: hrsystemComponents
    },
    {
        title: 'Restaurant',
        components: restaurantComponents
    },
    {
        title: 'Bookings',
        components: bookingsComponents
    },
    {
        title: 'Apis',
        components: apisComponents
    }
]

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <div >
            <SettingsNavigation navigation={navigation} />
            <div className='mt-4'>
                {children}
            </div>
        </div>
    )
}