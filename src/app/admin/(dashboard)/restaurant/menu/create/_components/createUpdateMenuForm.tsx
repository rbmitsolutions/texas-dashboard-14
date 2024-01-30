import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/common/libs/shadcn/utils';

//components
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SelectAddOnsToLink from '../item/_components/selectAddOnsToLink';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import SelectMenuToLink from './selectMenuToLink';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

//interfaces
import { Allergens, IMenuType, OptionsPriority } from '@/common/types/restaurant/menu.interface';

//libs
import { CreateMenuFormSchemaType } from '@/common/libs/zod/forms/restaurant/createMenuForm';

//hooks
import { IGETMenuAddOnsResponse, IGETMenuSectionsResponse, IGETPrintersResponse, IGETRestaurantDataQuery, IGETMenuResponse } from '@/hooks/restaurant/IGetRestaurantDataHooks.interface';

export interface ExtendedCreateMenuFormType extends UseFormReturn<CreateMenuFormSchemaType> { }

export interface CreateUpdateMenuProps {
    form: ExtendedCreateMenuFormType
    sections: {
        data: IGETMenuSectionsResponse
    }
    addOns: {
        data: IGETMenuAddOnsResponse
        setAddOns: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
        GETAddOns: IGETRestaurantDataQuery
        isLoading: boolean
    }
    printers: {
        data: IGETPrintersResponse
    }
    menu: {
        data: IGETMenuResponse
        isLoading: boolean
        setGETMenu: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
        GETMenu: IGETRestaurantDataQuery
    }
    menuTypes: {
        data: IMenuType[]
        isLoading: boolean
    }
    isCreateUpdateLoading: boolean
    type: 'create' | 'update'
}

const formStyle = {
    div: 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4'
}

export default function CreateUpdateMenuForm({ form, sections, menu, addOns, isCreateUpdateLoading, menuTypes, printers, type }: CreateUpdateMenuProps) {

    const handleUpdateGoWithIds = (id: string, to: 'add' | 'remove') => {
        if (to === 'add') {
            form.setValue('go_with_ids', [...form.getValues('go_with_ids'), id])
        }

        if (to === 'remove') {
            form.setValue('go_with_ids', form.getValues('go_with_ids')?.filter(f => f !== id))
        }

    }

    const handleUpdateOption = (id: string, to: 'add' | 'remove') => {
        if (to === 'add') {
            form.setValue('f_options', [...form.getValues('f_options'), id])
        }

        if (to === 'remove') {
            form.setValue('f_options', form.getValues('f_options')?.filter(f => f !== id))
        }

    }

    const handleUpdateAddOnsIds = (id: string, to: 'add' | 'remove') => {
        if (to === 'add') {
            form.setValue('add_ons', [...form.getValues('add_ons'), id])
        }

        if (to === 'remove') {
            form.setValue('add_ons', form.getValues('add_ons')?.filter(f => f !== id))
        }

    }

    return (
        <div className='flex-col-container gap-6 rounded-lg border-2 p-4'>
            <div className={cn(formStyle?.div)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Title for website / recipt</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="short_title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Title</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Short Title"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Title for order system / order print</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className={cn(formStyle?.div)}>
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background-soft">
                            <div className="space-y-0.5">
                                <FormLabel>Website</FormLabel>
                                <FormDescription>
                                    To show on website, do not forget to add image &#x1F601;
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="to_order"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background-soft">
                            <div className="space-y-0.5 ">
                                <FormLabel>Order System</FormLabel>
                                <FormDescription>
                                    To show on order system
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <div className={cn(formStyle?.div)}>
                <FormField
                    control={form.control}
                    name="mn_type_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Menu Type</FormLabel>
                            <Select onValueChange={field.onChange}
                                defaultValue={field.value || ''}
                                value={field.value || ''}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Menu Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sections?.data?.data?.map(sec => {
                                        return (
                                            <SelectGroup key={sec?.id}>
                                                <SelectLabel>{sec?.title}</SelectLabel>
                                                {sec?.types?.map(type => {
                                                    return (
                                                        <SelectItem key={type?.id} value={type?.id}>
                                                            {type?.title}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Type where menu will be displayed
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    max={200}

                                    placeholder="Price"
                                    {...field}
                                    onChange={(e) => {
                                        const roundedValue = parseFloat(Number(e.target.value).toFixed(2));
                                        field.onChange(roundedValue * 100);
                                    }}
                                    value={String(Number(field.value / 100))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="profit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profit Margin</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    placeholder="Profit Margin"
                                    {...field}
                                    onChange={(e) => {
                                        const roundedValue = parseFloat(e.target.value);
                                        field.onChange(roundedValue);
                                    }}
                                    value={String(Number(field.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Description"
                                className="resize-none h-32"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Description for website
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='flex-col-container border-2 p-4 rounded-xl bg-background-soft'>
                <FormLabel>Prerequisite</FormLabel>
                <SelectAddOnsToLink
                    addOns={addOns}
                    handleUpdateAddOnsIds={handleUpdateAddOnsIds}
                    add_ons_linked={form.watch('add_ons')}
                />
                <FormDescription>
                    Add all prerequisite to this dish
                </FormDescription>
            </div>
            <div className='flex-col-container border-2 p-4 rounded-xl bg-background-soft'>
                <FormLabel>Options of the Dish</FormLabel>
                <SelectMenuToLink
                    menu={menu}
                    menuTypes={menuTypes}
                    menu_ids_linked={form.watch('f_options')}
                    handleUpdateMenuIds={handleUpdateOption}
                />
                <FormDescription>
                    In case the dish can be made in different ways an pop-up will show it to select
                </FormDescription>
                <FormField
                    control={form.control}
                    name="options_priority"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Options Priority</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-container-center gap-6"
                                >
                                    {Object.keys(OptionsPriority).map((item) => {
                                        return (
                                            <FormItem key={item} className={cn("flex items-center space-x-3 space-y-0 p-2 rounded-lg ",
                                                item === 'LOW' && ' bg-background-soft',
                                                item === 'MEDIUM' && 'bg-blue-100 dark:bg-slate-800',
                                                item === 'HIGH' && 'bg-green-200 dark:bg-slate-700',
                                            )
                                            }>
                                                <FormControl>
                                                    <RadioGroupItem value={String(item)} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {item}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    })}
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                If this item is choose to be an options of another item, when the options pop-up appears with the dish choices, the options will be sorted by priority and highlighted with the corresponding color.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className='flex-col-container border-2 p-4 rounded-xl bg-background-soft'>
                <FormLabel>Goes With</FormLabel>
                <SelectMenuToLink
                    menu={menu}
                    menuTypes={menuTypes}
                    menu_ids_linked={form.watch('go_with_ids')}
                    handleUpdateMenuIds={handleUpdateGoWithIds}
                />
                <FormDescription>
                    Select items from the menu that goes with this item and an pop-up will open after the item is ordered, for example: Gim & Tonic
                </FormDescription>
            </div>
            <FormField
                control={form.control}
                name="allergens"
                render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Allergens</FormLabel>
                        </div>
                        <div className={cn(formStyle?.div, 'grid-cols-[repeat(auto-fit,minmax(150px,1fr))]')}>
                            {Object.values(Allergens).map((item) => (
                                <FormField
                                    key={item}
                                    control={form.control}
                                    name="allergens"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field?.value as string[], item])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal cursor-pointer">
                                                    {item}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                        <FormDescription>
                            Select allergens if needed
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="allergens"
                render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">To Print</FormLabel>
                        </div>
                        <div className={cn(formStyle?.div, 'grid-cols-[repeat(auto-fit,minmax(150px,1fr))]')}>
                            {printers?.data?.data?.map((item) => (
                                <FormField
                                    key={item?.id}
                                    control={form.control}
                                    name="to_print_ids"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item?.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.find(i => i === item?.id) ? true : false}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field?.value, item?.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="flex flex-col text-sm font-normal cursor-pointer">
                                                    {item?.title}
                                                    <small className='opacity-50'>
                                                        {item?.description}
                                                    </small>
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                        <FormDescription>
                            Select where the item should be printed
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className='flex justify-end gap-4'>
                <Button
                    type="submit"
                    leftIcon='Save'
                    isLoading={isCreateUpdateLoading}
                    disabled={isCreateUpdateLoading}
                >
                    {type === 'update' ? 'Update' : 'Create'}
                </Button>
            </div>
        </div>
    )
}