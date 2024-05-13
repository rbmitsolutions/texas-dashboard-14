'use client'
import { io } from "socket.io-client"
import { useEffect } from "react"

//store
import { useMenuSectionsStore } from "@/store/restaurant/menuSections"
import { usePrintersStore } from "@/store/restaurant/printers"
import { useSectionsStore } from "@/store/restaurant/sections"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IGETMenuSectionsResponse, IGETPrintersResponse, IGETSectionResponse, IGETTablesAllResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISocketMessage, SocketIoEvent, socket } from "@/common/libs/socketIo/types"
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks"

// const socket = io(process.env.NEXT_PUBLIC_URL! as string, {
//     path: '/socket.io',
//     transports: ['websocket'],
//     secure: true,
// });

export default function TexasLayout({ children }: any) {
    const { menuSections, setMenuSections } = useMenuSectionsStore()
    const { printers, setPrinters } = usePrintersStore()
    const { sections, setSections } = useSectionsStore()
    const { isMessageToMe } = useSocketIoHooks()

    const {
        refetchRestaurantData: refetchPrinters
    } = useGETRestaurantDataHooks({
        query: 'PRINTERS',
        defaultParams: {
            printers: {
                all: {
                    pagination: {
                        take: 50,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const printers = data as IGETPrintersResponse
                setPrinters(printers?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        refetchRestaurantData: refetchSections
    } = useGETRestaurantDataHooks({
        query: 'SECTIONS',
        defaultParams: {
            sections: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                    include: {
                        tables: {
                            guests: [2, 4, 6, 8]
                        }
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const sections = data as IGETSectionResponse
                setSections(sections?.data)
            },
        }
    })

    const {
        refetchRestaurantData: refetchMenuSections
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
            onSuccess: (data) => {
                const menuSections = data as IGETMenuSectionsResponse
                setMenuSections(menuSections?.data)
            },
        }
    })


    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (isMessageToMe({ event: message?.event, listemTo: [SocketIoEvent.TABLE] })) {
                refetchSections()
            }
        });
        () => {
            socket.off("message");
        }
    }, [isMessageToMe, refetchSections]);

    useEffect(() => {
        if (printers?.length === 0) {
            refetchPrinters()
        }

        if (menuSections?.length === 0) {
            refetchMenuSections()
        }

        if (sections?.length === 0) {
            refetchSections()
        }

    }, [menuSections?.length, printers?.length, refetchMenuSections, refetchPrinters, refetchSections, sections?.length])

    return (
        <div>
            {children}
        </div>
    )
}