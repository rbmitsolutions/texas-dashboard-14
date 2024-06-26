'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

//copmponents
import { menuColumnsTable } from "../../../../../../components/common/basicTable/columns/restaurant/menuColumns"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Wrap from "@/components/common/wrap"

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { Permissions } from "@/common/types/auth/auth.interface"

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"
import { BasicTable } from "@/components/common/basicTable"

export default function AllMenuPage() {
    const { user } = useAuthHooks()
    const router = useRouter()
    const [sectionSelected, setSectionSelected] = useState<string | undefined>('all')
    const {
        restaurantAllMenu: menu,
        setGETRestaurantDataParams: setMenu,
        GETRestaurantDataParams: GETMenu,
        refetchRestaurantData: refetchMenu,
        isRestaurantDataFetching: isMenuLoading,
        restaurantDataError: menuError
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        keepParmas: true,
        defaultParams: {
            menu: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    includes: {
                        mn_type: '1',
                    }
                }
            }
        }
    })

    const {
        restaurantAllMenuSections: menuSections,
        isRestaurantDataFetching: isMenuSectionLoading,
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    includes: {
                        types: '1',
                    }
                }
            }
        }
    })

    const {
        updateRestaurantData: updateMenu,
    } = usePUTRestaurantDataHooks({
        query: 'MENU',
        toRefetch: refetchMenu
    })

    const { deleteRestaurantData: deleteMenu } = useDELETERestaurantDataHooks({
        query: 'MENU',
        toRefetch: refetchMenu
    })

    const sectionsOptions = menuSections?.data?.map(section => ({
        label: section?.title,
        value: section?.id
    })) || []

    const typesOptions = sectionSelected !== 'all' ? menuSections?.data?.find(section => section?.id === sectionSelected)?.types?.map(types => ({
        label: types?.title,
        value: types?.id
    })) || [] : []

    return (
        <Wrap
            error={menuError}
            header={{
                title: {
                    title: 'Menu',
                    icon: 'UtensilsCrossed'
                },
                pagination: {
                    pagination: menu?.pagination,
                    queryPagination: GETMenu?.menu?.all?.pagination!,
                    isFetching: isMenuLoading,
                    onPageChange: (pagination) => setMenu(prev => ({
                        menu: {
                            all: {
                                ...prev?.menu?.all,
                                pagination
                            }
                        }
                    }))
                }
            }}
            actions={{
                toLeft: (
                    <div className='flex-container-center flex-wrap'>
                        <Button
                            onClick={() => router.push('/admin/restaurant/menu/create/section')}
                            leftIcon='ChefHat'
                            disabled={!isUserAuthorized(
                                user,
                                [Permissions.MENU_CREATE]
                            )}
                        >
                            New Item
                        </Button>
                        <label htmlFor="to_order" className='flex items-center cursor-pointer'>
                            <Checkbox
                                id='to_order'
                                checked={GETMenu?.menu?.all?.to_order}
                                onCheckedChange={(value) => setMenu(prev => ({
                                    menu: {
                                        all: {
                                            ...prev?.menu?.all,
                                            to_order: value ? true : false
                                        }
                                    }
                                }))}
                            />
                            <small className='ml-2'>On Order System</small>
                        </label>
                        <label htmlFor="website" className='flex items-center cursor-pointer'>
                            <Checkbox
                                id='website'
                                checked={GETMenu?.menu?.all?.website}
                                onCheckedChange={(value) => setMenu(prev => ({
                                    menu: {
                                        all: {
                                            ...prev?.menu?.all,
                                            website: value ? true : false
                                        }
                                    }
                                }))}
                            />
                            <small className='ml-2'>On Website</small>
                        </label>
                    </div>
                ),
                searchInput: {
                    onSearchChange: (e) => setMenu(prev => ({
                        menu: {
                            all: {
                                ...prev?.menu?.all,
                                pagination: {
                                    take: 20,
                                    skip: 0
                                },
                                title: e
                            }
                        }
                    })),
                    value: GETMenu?.menu?.all?.title || '',
                    placeholder: 'Search menu by title ...'
                },
                optionsPopover: {
                    isLoading: isMenuSectionLoading,
                    options: [
                        {
                            label: 'By Section',
                            placeholder: 'By Section',
                            value: GETMenu?.menu?.all?.section_id || '',
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...sectionsOptions
                            ],
                            onChange: (value) => {
                                setSectionSelected(value)
                                setMenu(prev => ({
                                    menu: {
                                        all: {
                                            ...prev?.menu?.all,
                                            section_id: value === 'all' ? undefined : value,
                                            mn_type_id: undefined
                                        }
                                    }
                                }))
                            }
                        },
                        {
                            label: 'By types',
                            placeholder: 'By types',
                            value: GETMenu?.menu?.all?.mn_type_id || '',
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...typesOptions
                            ],
                            onChange: (value) => setMenu(prev => ({
                                menu: {
                                    all: {
                                        ...prev?.menu?.all,
                                        mn_type_id: value === 'all' ? undefined : value
                                    }
                                }
                            }))
                        }
                    ]
                },
                className: 'grid grid-cols-1 justify-end items-center gap-4 lg:grid-cols-[1fr,300px,40px]'
            }}
        >
            <BasicTable
                columns={menuColumnsTable({
                    redirectTo: (path: string) => router.push(path),
                    allowUpdate: isUserAuthorized(
                        user,
                        [Permissions.MENU_UPDATE]
                    ),
                    onDelete: (id: string) => deleteMenu({
                        menu: {
                            id
                        }
                    }),
                    allowDelete: isUserAuthorized(
                        user,
                        [Permissions.MENU_DELETE]
                    ),
                    udpateMenu: (data) => updateMenu({
                        menu: {
                            menu: {
                                ...data!
                            }
                        }
                    }),
                })}
                data={menu?.data || []}
            />
        </Wrap >
    )
}