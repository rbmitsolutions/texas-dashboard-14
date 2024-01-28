import { CreateMenuAddOnsFormSchemaType } from "@/common/libs/zod/forms/restaurant/createAddOnsForm"
import { IMenuAddOns } from "@/common/types/restaurant/menu.interface"
import { IPOSTMenuAddOnsBody } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTMenuAddOnsBody, IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"

export const getUpdateInfo = (data: CreateMenuAddOnsFormSchemaType, menuAddOns: IMenuAddOns): IPUTMenuAddOnsBody => {
    const menuIdsChanged = menuAddOns?.menu?.map(m => m.id).sort().join(',') !== data?.menu_ids?.sort().join(',')
    const optionsChanged = menuAddOns?.options?.map(o => o.title + o.value).sort().join(',') !== data?.options?.map(p => p.title + p.value).sort().join(',')

    let updateInfo: IPUTRestaurantBody['menu_add_ons'] = {
        id: menuAddOns?.id,
        is_mandatory: data?.is_mandatory,
        title: data?.title,
        flag: data?.flag,
        multiple: data?.multiple,
        min: data?.min,
        max: data?.min > data?.max ? 999 : data?.max,
    }

    let menu_remove_ids: string[] = []
    let menu_add_ids: string[] = []

    let options_remove_ids: string[] = []
    let options_add: IPOSTMenuAddOnsBody['options'] = []

    if (menuIdsChanged) {
        menu_remove_ids = menuAddOns?.menu?.map(m => m.id).filter(f => !data?.menu_ids?.includes(f))
        menu_add_ids = data?.menu_ids?.filter(f => !menuAddOns?.menu?.map(m => m.id).includes(f))
    }

    if (optionsChanged) {
        options_add = data?.options?.filter(o => {
            return !menuAddOns?.options?.map(o => o.title + o.value).includes(o.title + o.value)
        })
        options_remove_ids = menuAddOns?.options?.map(o => {
            if (!data?.options?.map(o => o.title + o.value).includes(o.title + o.value)) {
                return o.id
            }

            return ''
        }).filter(f => f !== '')

    }

    return {
        ...updateInfo,
        menu_ids: {
            add_ids: menu_add_ids,
            remove_ids: menu_remove_ids
        },
        options: {
            add: options_add,
            remove_ids: options_remove_ids
        }
    }
}