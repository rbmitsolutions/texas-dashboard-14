import Icon from "@/common/libs/lucida-icon"
import SearchInput from "@/components/common/searchInput"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { icons } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

interface ILinksData {
    id: number
    title: string
    description: string
    path: string
    key_words: string[]
}
interface IData {
    id: number
    title: string
    key_words: string[]
    icon: keyof typeof icons
    links: ILinksData[]
}
const data: IData[] = [
    {
        id: 1,
        title: 'Menu',
        key_words: ['menu', 'menu section', 'menu type', 'create menu', 'create menu section', 'create menu type', 'menu list', 'menu section list', 'menu type list', 'menu prerequisite', 'menu section prerequisite', 'menu type prerequisite', 'menu prerequisite list', 'menu section prerequisite list', 'menu type prerequisite list'],
        icon: 'ChefHat',
        links: [
            {
                id: 1,
                title: 'Menu List',
                description: 'List of the items in the menu',
                path: '/admin/restaurant/menu/all',
                key_words: ['menu', 'menu list', 'restaurant menu'],
            },
            {
                id: 2,
                title: 'Create Menu',
                description: 'Create a new menu item',
                path: '/admin/restaurant/menu/create/item',
                key_words: ['create menu', 'create menu item', 'new menu item', 'new menu'],
            },
            {
                id: 3,
                title: 'Create Menu Section',
                description: 'Create a new menu section',
                path: '/admin/restaurant/menu/create/section',
                key_words: ['create menu section', 'create section', 'new menu section', 'new section'],
            },
            {
                id: 4,
                title: 'Create Menu Type',
                description: 'Create a new menu type',
                path: '/admin/restaurant/menu/create/section',
                key_words: ['create menu type', 'create type', 'new menu type', 'new type'],
            },
            {
                id: 5,
                title: 'Create Menu Prequisite',
                description: 'Create a new menu prerequisite',
                path: '/admin/restaurant/menu/create/prerequisite',
                key_words: ['create menu prerequisite', 'create prerequisite', 'new menu prerequisite', 'new prerequisite'],
            },

        ]
    },
    {
        id: 2,
        title: 'Employees',
        key_words: ['employees', 'employee', 'emp', 'emps', 'empl', 'empls', 'filled', 'fill', 'gone', 'fired', 'employees filled', 'employee filled', 'emp filled', 'emps filled', 'empl filled', 'empls filled', 'employee filled list', 'employees filled list', 'employee filled list'],
        icon: 'Users',
        links: [
            {
                id: 1,
                title: 'Employees',
                description: 'List of employees working',
                path: '/admin/hrsystem/employees/all',
                key_words: ['employees', 'employee', 'emp', 'emps', 'empl', 'empls', 'employee list', 'employees list', 'employee list']
            },
            {
                id: 2,
                title: 'Employees Filled',
                description: 'List of employees filled',
                path: '/admin/hrsystem/employees/filled',
                key_words: ['employees filled', 'employee filled', 'emp filled', 'emps filled', 'empl filled', 'empls filled', 'employee filled list', 'employees filled list', 'employee filled list']
            }
        ]
    },
    {
        id: 3,
        title: 'Reports',
        key_words: ['reports', 'report', 'rep', 'reps', 'report list', 'reports list', 'report list', 'create report', 'create reports', 'create rep', 'create reps', 'create report list', 'create reports list', 'create report list'],
        icon: 'FileText',
        links: [{
            id: 1,
            title: 'Reports',
            description: 'List of reports',
            path: '/admin/hrsystem/reports/all',
            key_words: ['reports', 'report', 'rep', 'reps', 'report list', 'reports list', 'report list']
        }, {
            id: 2,
            title: 'Create Report',
            description: 'Create a new report',
            path: '/admin/hrsystem/reports/create',
            key_words: ['create report', 'create reports', 'create rep', 'create reps', 'create report list', 'create reports list', 'create report list']
        }]
    },
    {
        id: 4,
        title: 'Forms',
        icon: 'FileText',
        key_words: ['forms', 'form', 'frm', 'frms', 'form data', 'forms data', 'form data', 'create form', 'create forms', 'create frm', 'create frms', 'create form data', 'create forms data', 'create form data'],
        links: [
            {
                id: 1,
                title: 'Forms',
                description: 'List of forms data',
                path: '/admin/hrsystem/forms/data',
                key_words: ['forms', 'form', 'frm', 'frms', 'form data', 'forms data', 'form data']
            },
            // {
            //     id: 2,
            //     title: 'Create Form',
            //     description: 'Create a new form',
            //     path: '/admin/hrsystem/forms/create',
            //     key_words: ['create form', 'create forms', 'create frm', 'create frms', 'create form data', 'create forms data', 'create form data']
            // }
        ]
    },
    {
        id: 5,
        title: 'Settings',
        icon: 'Settings',
        key_words: ['sett', 'config', 'conf', 'configu', 'configuration', 'settings', 'company details', 'texas details', 'details', 'info', 'contacts', 'emergency contacts', 'texas contacts', 'menager contact', 'texas documents', 'documents', 'important links', 'link', 'texas links', 'departamnets', 'create departaments', 'roles', 'change role', 'update role', 'create role', 'delete role', 'permissions', 'new permission', 'duties', 'duty', 'shifts', 'edit shift', 'create shift', 'edit shift', 'restaurant sections', 'restaurant tables', 'edit tables', 'edit section', 'auth devices', 'auth', 'devices', 'printers', 'print', 'prin', 'new printer', 'delete printer', 'update printer', 'open days', 'booking days open', 'special days', 'close day open', 'close day', 'close time', 'close'],
        links: [
            {
                id: 1,
                title: 'Company Details',
                description: 'Update compay details such as contacts, documents and links',
                key_words: ['company details', 'texas details', 'details', 'info', 'contacts', 'emergency contacts', 'texas contacts', 'menager contact', 'texas documents', 'documents', 'important links', 'link', 'texas links'],
                path: '/admin/settings/company/details'
            },
            {
                id: 2,
                title: 'Company Contacts',
                description: 'Update compay contacts',
                key_words: ['company details', 'texas details', 'details', 'info', 'contacts', 'emergency contacts', 'texas contacts', 'menager contact', 'texas documents', 'documents', 'important links', 'link', 'texas links'],
                path: '/admin/settings/company/contacts'
            },
            {
                id: 3,
                title: 'Company Documets',
                description: 'Update compay documents ',
                key_words: ['company details', 'texas details', 'details', 'info', 'contacts', 'emergency contacts', 'texas contacts', 'menager contact', 'texas documents', 'documents', 'important links', 'link', 'texas links'],
                path: '/admin/settings/company/documents'
            },
            {
                id: 4,
                title: 'Company Links',
                description: 'Update compay links',
                key_words: ['company details', 'texas details', 'details', 'info', 'contacts', 'emergency contacts', 'texas contacts', 'menager contact', 'texas documents', 'documents', 'important links', 'link', 'texas links'],
                path: '/admin/settings/company/links'
            },
            {
                id: 5,
                title: 'Departments Settings',
                description: 'Update  departments',
                key_words: ['company details', 'departamnets', 'create departaments'],
                path: '/admin/settings/hrsystem/departments'
            },
            {
                id: 6,
                title: 'Roles Settings',
                description: 'Update  Roles',
                key_words: ['roles', 'change role', 'update role', 'create role', 'delete role', 'permissions', 'permission'],
                path: '/admin/settings/hrsystem/roles'
            },
            {
                id: 7,
                title: 'Duties Settings',
                description: 'Update  Duties',
                key_words: ['duties', 'duty'],
                path: '/admin/settings/hrsystem/duties'
            },
            {
                id: 8,
                title: 'Shifts Settings',
                description: 'Update  Shifts',
                key_words: ['shifts', 'edit shift', 'create shift', 'edit shift',],
                path: '/admin/settings/hrsystem/shifts'
            },
            {
                id: 9,
                title: 'Restaurant Tables',
                description: 'Update Tables',
                key_words: ['restaurant sections', 'restaurant tables', 'edit tables', 'edit section'],
                path: '/admin/settings/restaurant/sections'
            },
            {
                id: 10,
                title: 'Restaurant Sections',
                description: 'Update Sections',
                key_words: ['restaurant sections', 'restaurant tables', 'edit tables', 'edit section'],
                path: '/admin/settings/restaurant/sections'
            },
            {
                id: 11,
                title: 'Auth Devices',
                description: 'Update  Auth Devices',
                key_words: ['auth devices', 'auth', 'devices'],
                path: '/admin/settings/restaurant/authdevices'
            },
            {
                id: 12,
                title: 'Printers',
                description: 'Update  Printers',
                key_words: ['printers', 'print', 'prin', 'new printer', 'delete printer', 'update printer'],
                path: '/admin/settings/restaurant/printers'
            },
            {
                id: 13,
                title: 'Bookings Open Days',
                description: 'Update  Open Days',
                key_words: ['open days', 'booking days open', 'special days', 'close day open', 'close day', 'close time', 'close'],
                path: '/admin/settings/bookings/opendays'
            },
            {
                id : 14,
                title : 'Booking Special Days',
                description : 'Update  Special Days',
                key_words : ['open days', 'booking days open', 'special days', 'close day open', 'close day', 'close time', 'close'],
                path : '/admin/settings/bookings/specialdays'
            }
        ]
    }
]

export default function AppSearching() {
    const [search, setSearch] = useState('')

    const onOpenChange = () => {
        setSearch('')
    }

    const filteredData = useMemo(() => {
        return data
            .filter((item) =>
                item.key_words.some((keyword) => keyword.includes(search.toLowerCase()))
            )
            .map((item) => ({
                ...item,
                links: item.links.filter((link) =>
                    link.key_words.some((keyword) => keyword.includes(search.toLowerCase()))
                ),
            }));
    }, [search]);


    return (
        <Dialog
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    leftIcon='Search'
                    className="hidden sm:flex sm:justify-start sm:w-40 md:w-40 lg:w-80"
                >
                    Search ...
                </Button>
            </DialogTrigger>
            <DialogContent className="!p-0 sm:max-w-[425px]">
                <div className='bg-background-soft'>
                    <div className='px-4 pt-2'>

                        <SearchInput
                            onSearchChange={(e: string) => setSearch(e)}
                            value={search}
                            debounceDelay={20}
                            custom='w-[90%]'
                        />
                    </div>
                    <div className="flex-col-container min-h-80 h-80 max-h-80  p-4 rounded-lg overflow-auto scrollbar-thin">
                        {filteredData.map(i => {
                            return (
                                <div key={i.id} className='flex-col-container gap-1'>
                                    <div className='flex-container-center'>
                                        <Icon name={i.icon} size={14} />
                                        <strong>{i.title}</strong>
                                    </div>
                                    {i.links?.map(l => {
                                        return (
                                            <Link
                                                key={l?.id}
                                                href={l.path}
                                                className='p-2 rounded-lg bg-background/30 hover:bg-background'
                                            >
                                                <div className='flex-container-center gap-2 justify-between w-full'>
                                                    <span className='text-sm'>{l.title}</span>
                                                    <Icon name='ChevronRight' size={14} />
                                                </div>
                                                <p className='text-xs text-foreground/30'>{l.description}</p>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )
                        })}
                        {filteredData?.length === 0 &&
                            <div className='flex justify-center items-center border-dashed border-2 rounded-lg h-full'>
                                <span className='text-sm'>No results</span>
                            </div>
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

