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
        title: "Sections / Tables",
        href: "/admin/settings/restaurant/sections",
        description: "Update Sections and Tables",
    },
    {
        title: 'Auth Devices',
        href: '/admin/settings/restaurant/authdevices',
        description: 'Update Auth Devices'
    },
    {
        title: 'Printers',
        href: '/admin/settings/restaurant/printers',
        description: 'Update Printers'
    },
]

const bookingsComponents = [
    {
        title: "Times Open",
        href: "/admin/settings/bookings/timesopen",
        description: "Update Times Open",
    },
    {
        title: 'Special Days',
        href: '/admin/settings/bookings/specialdays',
        description: 'Update Special Days'
    },
]
const apisComponents = [
    {
        title: "Sms",
        href: "/admin/settings/apis/sms",
        description: "Sms Api",
    },
    {
        title: "Files",
        href: "/admin/settings/apis/files",
        description: "Files Api",
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
            <div className='mt-6'>
                {children}
            </div>
        </div>
    )
}