'use client'
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import LayoutFrame from "../../../_components/layoutFrame";
import MenuOrderItem from "./_components/menuOrderItem";

export default function Table({ params }: { params: { id: string } }) {
    const {
        restaurantAllMenu: menu,
        setGETRestaurantDataParams: setMenu,
        GETRestaurantDataParams: GETMenu,
        isRestaurantDataFetching: isMenuLoading,
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        defaultParams: {
            menu: {
                all: {
                    pagination: {
                        take: 50,
                        skip: 0
                    },
                    includes: {
                        mn_type: '1',
                        add_ons: '1',
                    },
                    to_order: true
                }
            }
        }
    })

    // const {
    //     restaurantAllMenuAddOns: addOns,
    //     // setGETRestaurantDataParams: setMenu,
    //     // GETRestaurantDataParams: GETMenu,
    //     isRestaurantDataFetching: isAddOnsLoading,
    // } = useGETRestaurantDataHooks({
    //     query: 'MENU',
    //     defaultParams: {
    //         menu: {
    //             all: {
    //                 pagination: {
    //                     take: 50,
    //                     skip: 0
    //                 },
    //                 includes: {
    //                     mn_type: '1',
    //                 }
    //             }
    //         }
    //     }
    // })

    if(isMenuLoading) return <h1>Loading...</h1>

    return (
        <LayoutFrame
            navigation={{
                content: (
                    <div>
                        <h1> oi</h1>
                    </div>
                )
            }}
            rightNavigation={{
                content: (
                    <div>
                        <h1> oi</h1>
                    </div>
                ),
                icon: <div />,
                title: 'Shopping Cart',

            }}
        >
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6'>

                {menu?.data?.map((m) => (
                    <MenuOrderItem
                        menu={m}
                        key={m?.id}
                        bg={'bg-orange-600'}
                    />
                ))}

            </div>
        </LayoutFrame>
    )
}