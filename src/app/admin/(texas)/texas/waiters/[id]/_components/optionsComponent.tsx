import { IMenu } from "@/common/types/restaurant/menu.interface"
import { Button } from "@/components/ui/button"

interface MenuOptionsComponentProps {
    options: IMenu[]
    updateMenuItem: (data: IMenu) => void
}


export default function MenuOptionsComponent({ options, updateMenuItem }: MenuOptionsComponentProps) {
    // const menu = MENU2 //need to find the menu item by its id (menu_id)

    return (
        <div className='flex justify-center items-center  w-full h-full'>
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3   w-full'>
                {/* {options?.map((option, index) => {
                    return (
                        // <MenuOrderItem menu={menu} key={index} bg='' />
                        <Button
                            key={index}
                            type='button'
                            className={'flex-container-center justify-center min-h-40 max-h-60 h-full w-full rounded-xl border-2 hover:bg-transparent'}
                            onClick={() => updateMenuItem(menu)}
                        >
                            <h1>{menu?.short_title}</h1>
                        </Button>
                    )
                })} */}
            </div>
        </div>
    )
}