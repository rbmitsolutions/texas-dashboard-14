import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "react-query";
import toast from "react-hot-toast";

//components
import { CreateMenuAddOnsFormSchema, CreateMenuAddOnsFormSchemaType } from "@/common/libs/zod/forms/restaurant/createAddOnsForm";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SelectMenuToLink from "../../_components/selectMenuToLink";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import AddOnsOptions from "./addOnsOptions";
import { getUpdateAddOnsInfo } from "./config";

//interface
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface";
import { IGETRestaurantDataQuery, IGETMenuResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IMenuAddOns, IMenuType } from "@/common/types/restaurant/menu.interface";
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface ExtendedAddOnsFormType extends UseFormReturn<CreateMenuAddOnsFormSchemaType> { }

interface CreateMenuAddOnsFormProps {
    createAddOns: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    updateAddOns: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    isLoading: boolean
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
    actions: {
        setToEdit: React.Dispatch<React.SetStateAction<IMenuAddOns | undefined>>
    }
    menuAddOns?: IMenuAddOns
}


export default function CreateUpdateMenuAddOnsForm({ menuAddOns, createAddOns, updateAddOns, menuTypes, actions, menu, isLoading }: CreateMenuAddOnsFormProps) {
    const form = useForm<CreateMenuAddOnsFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateMenuAddOnsFormSchema),
        defaultValues: {
            flag: '',
            is_mandatory: false,
            title: '',
            options: [],
            menu_ids: [],
            min: 0,
            max: 999,
            multiple: false
        },
    });

    const handleUpdateMenuIds = (id: string, to: 'add' | 'remove') => {
        if (to === 'add') {
            form.setValue('menu_ids', [...form.getValues('menu_ids'), id])
        }

        if (to === 'remove') {
            form.setValue('menu_ids', form.getValues('menu_ids')?.filter(f => f !== id))
        }
    }

    const handleClear = () => {
        actions.setToEdit(undefined)
        form.reset()
    }

    const onSubmitForm: SubmitHandler<CreateMenuAddOnsFormSchemaType> = async (formData) => {
        if (formData?.options?.length < 2) {
            toast.error('You must have at least two options')
            return
        }

        if (menuAddOns) {
            const info = getUpdateAddOnsInfo(formData, menuAddOns)

            await updateAddOns({
                menu_add_ons: info
            }, {
                onSuccess: () => {
                    handleClear()
                }
            })
            return
        } else {
            await createAddOns({
                menu_add_ons: {
                    is_mandatory: formData?.is_mandatory,
                    menu_ids: formData?.menu_ids,
                    options: formData?.options,
                    title: formData?.title,
                    flag: formData?.flag,
                    max: formData?.max,
                    min: formData?.min,
                    multiple: formData?.multiple
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }
    };

    useEffect(() => {
        if (menuAddOns) {
            form.setValue('flag', menuAddOns?.flag)
            form.setValue('is_mandatory', menuAddOns?.is_mandatory)
            form.setValue('title', menuAddOns?.title)
            form.setValue('options', menuAddOns?.options)
            form.setValue('menu_ids', menuAddOns?.menu?.map(m => m.id))
            form.setValue('min', menuAddOns?.min)
            form.setValue('max', menuAddOns?.max)
            form.setValue('multiple', menuAddOns?.multiple)
        }
    }, [form, menuAddOns])
    return (
        <Form {...form}>
            <form
                className='flex-col-container border-2 p-4 rounded-xl'
                onSubmit={form.handleSubmit(onSubmitForm)}>
                <h1 className='font-bold text-lg'>
                    {menuAddOns ? 'Edit' : 'Create'}
                </h1>
                <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Sauce"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="flag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Flag</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="on-side"
                                        {...field}
                                        readOnly={form.watch('multiple')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="is_mandatory"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background-soft">
                            <div className="space-y-0.5">
                                <FormLabel>Mandatory</FormLabel>
                                <FormDescription>
                                    Is this prerequisite mandatory? If yes, the user will not be able to order the dish without this prerequisite.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={(e) => {
                                        form.setValue('min', e ? 1 : 0)
                                        form.setValue('multiple', false)
                                        field.onChange(e)
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className='flex-col-container border-2 p-4 rounded-xl bg-background-soft'>
                    <FormLabel>Options</FormLabel>
                    <AddOnsOptions
                        form={form}
                    />
                    <FormDescription>
                        You can link this prerequisite to
                    </FormDescription>
                </div>
                <div className='flex-col-container border-2 p-4 rounded-xl gap-4 bg-background-soft'>
                    <FormField
                        control={form.control}
                        name="multiple"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background-soft">
                                <div className="space-y-0.5">
                                    <FormLabel>Mutiple Choise</FormLabel>
                                    <FormDescription>
                                        Can the user select more than one option? if yes, the &quot;flag&quot; will be ignored.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        disabled={form.watch('options').length < 2 ? true : false}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {form?.watch('multiple') &&
                        <>
                            <FormField
                                control={form.control}
                                name="min"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Min</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(e: string) => field.onChange(Number(e))}
                                                defaultValue={String(field.value)}
                                                className="flex flex-wrap gap-4"
                                            >
                                                {[...Array(form.watch('options').length)].map((_, i) => {
                                                    return (
                                                        <FormItem key={i} className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem
                                                                    disabled={(form?.watch('is_mandatory') && i) === 0 ? true : false}
                                                                    value={String(i)}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {i}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                })}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormDescription>
                                            If you select a minimum, the user will have to select at least that number of options.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="max"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Max</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(e: string) => field.onChange(Number(e))}
                                                defaultValue={String(field.value)}
                                                className="flex flex-wrap gap-4"
                                            >
                                                {[...Array(form.watch('options').length - form.watch('min') - 1)].map((_, i) => {
                                                    const value = i + form.watch('min')
                                                    return (
                                                        <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={String(value)} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {value}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                })}
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={'999'} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        All
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormDescription>
                                            If you select a maximum, the user will not be able to select more than that number of options.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </>
                    }
                </div>

                <div className='flex-col-container border-2 p-4 rounded-xl bg-background-soft'>
                    <FormLabel>Menu to Link</FormLabel>
                    <SelectMenuToLink
                        menu_ids_linked={form.watch('menu_ids')}
                        menu={menu}
                        handleUpdateMenuIds={handleUpdateMenuIds}
                        menuTypes={menuTypes}
                    />
                    <FormDescription>
                        You can link this prerequisite to a menu item, or leave it to link when you are creating the menu item.
                    </FormDescription>
                </div>
                <div className='flex-container-center justify-end'>
                    {
                        menuAddOns &&
                        <Button
                            type="button"
                            className='self-end'
                            leftIcon='Brush'
                            isLoading={isLoading}
                            disabled={isLoading}
                            onClick={handleClear}
                            variant='secondary'
                        >
                            Clear
                        </Button>
                    }
                    <Button
                        type="submit"
                        className='self-end'
                        leftIcon='Save'
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {menuAddOns ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}