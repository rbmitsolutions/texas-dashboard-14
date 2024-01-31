'use client'
import { useEffect, useState } from "react";

//components
import { IGETMenuOrderSystemResponse, IGETRestaurantResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { MenuOrderItem } from "./_components/menuOrderItem";
import LayoutFrame from "../../../_components/layoutFrame";
import SearchInput from "@/components/common/searchInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

//store
import { IMenuOrderSystemFilter, useOrderSystemMenuStore } from "@/store/texas/menu";

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

//interfaces
import { Allergens } from "@/common/types/restaurant/menu.interface";

export default function Table({ params }: { params: { id: string } }) {
    const [filter, setFilter] = useState<IMenuOrderSystemFilter>({
        allergens: [],
        id: [],
        sort: {
            options_priority: true
        },
        short_title: '',
        to_order: true
    })
    const { menu, setMenu } = useOrderSystemMenuStore()


    const {
        restaurantMenuOrderSystem: menuData,
        isRestaurantDataLoading: isMenuLoading
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        defaultParams: {
            menu: {
                order_system: '1'
            }
        },
        UseQueryOptions: {
            onSuccess: (data: IGETRestaurantResponse) => {
                setMenu({
                    menu: data as IGETMenuOrderSystemResponse[]
                })
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        restaurantAllMenuSections: sections
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    includes: {
                        types: '1'
                    },
                    pagination: {
                        take: 200,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    useEffect(() => {
        if (menuData) {
            setMenu({
                menu: menuData
            })
        }
    }, [menuData, setMenu])

    useEffect(() => {
        if (menuData) {
            setMenu({
                menu: menuData,
                menuFilter: filter
            })
        }
    }, [filter, menuData, setMenu])

    if (isMenuLoading) return <h1>Loading...</h1>

    return (
        <LayoutFrame
            navigation={{
                content: (
                    <div className='flex flex-col gap-2'>
                        {sections?.data?.map(s => {
                            return (
                                <div key={s?.id}>
                                    <small className='text-xs'>{s?.title}</small>
                                    <div className='flex flex-col gap-2 mt-1'>
                                        {s?.types?.map(t => {
                                            return (
                                                <Button
                                                    key={t?.id}
                                                    variant={filter?.mn_type_id === t?.id ? 'secondary' : 'outline'}
                                                    className='h-12 rounded-lg'
                                                    onClick={() => {
                                                        setFilter({
                                                            ...filter,
                                                            mn_type_id: t?.id
                                                        })
                                                    }}
                                                >
                                                    {t?.title}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            }}
            rightNavigation={{
                content: (
                    <div >
                        <h1> oi</h1>
                    </div>
                ),
                icon: <div />,
                title: 'Shopping Cart',

            }}
            main={{
                header: (
                    <div className='grid grid-row-2 rounded-lg w-full h-full p-2 px-4 bg-background-soft'>
                        <div className='flex gap-4 scrollbar-thin overflow-auto'>
                            {Object.values(Allergens).map(a => {
                                return (
                                    <label key={a}
                                        htmlFor={a}
                                        className='flex items-center gap-2 text-xs'
                                    >
                                        <Checkbox
                                            id={a}
                                            checked={filter?.allergens?.includes(a)}
                                            onCheckedChange={(e) => setFilter(prev => {
                                                if (e) {
                                                    return {
                                                        allergens: [...prev?.allergens || [], a]
                                                    }
                                                } else {
                                                    return {
                                                        allergens: prev?.allergens?.filter((al) => al !== a)
                                                    }
                                                }
                                            })}
                                        />
                                        <span>{a}</span>
                                    </label>
                                )
                            })}
                        </div>
                        <SearchInput
                            value={filter?.short_title || ''}
                            placeholder="Search for a menu item"
                            onSearchChange={(e) => setMenu({
                                menu: menuData,
                                menuFilter: {
                                    short_title: e
                                }
                            })}
                        />
                    </div>
                )
            }}
        >
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6'>
                {menu?.map((m) => (
                    <MenuOrderItem
                        menu={m}
                        key={m?.id}
                        bg={''}
                        menuData={menuData}
                    />
                ))}

            </div>
        </LayoutFrame>
    )
}
