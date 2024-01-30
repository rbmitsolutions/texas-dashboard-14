import { CreateMenuFormSchemaType } from "@/common/libs/zod/forms/restaurant/createMenuForm"
import { IFiles } from "@/common/types/company/files.interface"
import { IMenu, OptionsPriority } from "@/common/types/restaurant/menu.interface"
import { IPUTMenuBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"

export const getOptionsPriorityValueAsKeyString =(value: string): string => {
    for (const key in OptionsPriority) {
      if (OptionsPriority[key as keyof typeof OptionsPriority] === value) {
        return key;
      }
    }
    return 'LOW'
  }

export const getUpdateMenuInfo = (data: CreateMenuFormSchemaType, menu: IMenu, files:IFiles[]): IPUTMenuBody => {
    const hasThumbnailChanged = data.thumbnail !== menu.thumbnail
    const hasImagesChanged = data.images?.map((option) => option).join() !== files?.map((option) => option.url).join()
    const hasFOptionsChanged = data.f_options?.map((option) => option).join() !== menu.f_options?.map((option) => option.id).join()
    const hasGoWithChanged = data.go_with_ids?.map((option) => option).join() !== menu.go_with_ids?.map((option) => option).join()
    const hadAddOnsChanged = data.add_ons?.map((option) => option).join() !== menu.add_ons?.map((option) => option?.id).join()

    let updatedMenu: IPUTMenuBody = {
        menu: {
            id: menu.id,
            title: data.title,
            short_title: data.short_title,
            description: data.description,
            value: data.value,
            profit: data.profit,

            mn_type_id: data.mn_type_id,
            website: data.website,
            to_order: data.to_order,
            options_priority: Number(OptionsPriority[data.options_priority as keyof typeof OptionsPriority]),
            to_print_ids: data.to_print_ids,
            allergens: data.allergens,
        }
    } as IPUTMenuBody

    if(hasThumbnailChanged) {
        updatedMenu.menu.thumbnail = data.thumbnail
    }

    if(hasImagesChanged) {
        updatedMenu.menu.images = {
            add: data.images?.filter(f => !files?.map((option) => option.url).includes(f)).filter(f => f !== "") as string[],
            remove: files?.filter(f => !data.images?.includes(f.url)).map(f => f.id) as string[]
        }
    }

    if(hasFOptionsChanged) {
        updatedMenu.menu.f_options = {
            remove: menu.f_options?.map(o => o?.id).filter(o => !data.f_options?.includes(o)),
            add: data.f_options?.filter(f => !menu.f_options?.map(o => o?.id).includes(f)).filter(f => f !== "")
        }
    }

    if(hasGoWithChanged) {
        updatedMenu.menu.go_with_ids = {
            remove: menu.go_with_ids?.map(o => o).filter(o => !data.go_with_ids?.includes(o)),
            add: data.go_with_ids?.filter(f => !menu.go_with_ids?.map(o => o).includes(f)).filter(f => f !== "")
        }
    }

    if(hadAddOnsChanged) {
        updatedMenu.menu.add_ons = {
            remove: menu.add_ons?.map(o => o?.id).filter(o => !data.add_ons?.includes(o)),
            add: data.add_ons?.filter(f => !menu.add_ons?.map(o => o?.id).includes(f)).filter(f => f !== "")
        }
    }


    return updatedMenu
}