'use client'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from 'react';

//components
import UploadMenuImages from './_components/uploadMenuImages';
import { Form } from '@/components/ui/form';

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useDebounce } from '@/common/utils/useDebouce';

//libs
import { CreateMenuFormSchema, CreateMenuFormSchemaType } from "@/common/libs/zod/forms/restaurant/createMenuForm";
import { OptionsPriority } from '@/common/types/restaurant/menu.interface';
import CreateUpdateMenuForm from '../_components/createUpdateMenuForm';

export default function Create() {
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
                        take: 10,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        restaurantAllMenuTypes: menuTypes,
        isRestaurantDataFetching: isMenuTypesLoading,
    } = useGETRestaurantDataHooks({
        query: 'MENU_TYPE',
        defaultParams: {
            menu_types: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    }
                }
            }
        }
    })


    const {
        restaurantAllPrinters: printers,
    } = useGETRestaurantDataHooks({
        query: 'PRINTERS',
        defaultParams: {
            printers: {
                all: {
                    pagination: {
                        take: 40,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        restaurantAllMenuSections: section,
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    pagination: {
                        take: 40,
                        skip: 0
                    },
                    includes: {
                        types: '1'
                    }
                }
            }
        }
    })

    const {
        restaurantAllMenuAddOns: addOns,
        isRestaurantDataFetching: isAddOnsLoading,
        setGETRestaurantDataParams: setAddOns,
        GETRestaurantDataParams: GETAddOns,
    } = useGETRestaurantDataHooks({
        query: 'MENU_ADD_ONS',
        defaultParams: {
            menu_add_ons: {
                all: {
                    pagination: {
                        take: 5,
                        skip: 0
                    },
                    title: '',
                }
            }
        }
    })

    const {
        createRestaurantData: createMenu,
        createRestaurantDataResponse: createMenuResponse,
        isCreateRestaurantDataLoading: isCreateMenuLoading,
    } = usePOSTRestaurantDataHooks({
        query: 'MENU',
    })

    const form = useForm<CreateMenuFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateMenuFormSchema),
        defaultValues: {
            title: '',
            short_title: '',
            description: '',
            thumbnail: '',
            value: 0,
            profit: 0,
            images: [],
            to_print_ids: [],
            mn_type_id: '',
            website: false,
            to_order: false,
            allergens: [],
            go_with_ids: [],
            add_ons: [],

            f_options: [],
            options_priority: 'LOW',
        },
    });



    const onSubmitForm: SubmitHandler<CreateMenuFormSchemaType> = async (formData) => {
        await createMenu({
            menu: {
                ...formData,
                value: Number(formData.value.toFixed(2)),
                options_priority: Number(OptionsPriority[formData.options_priority as keyof typeof OptionsPriority]),
            }
        }, {
            onSuccess: () => {
                localStorage.removeItem('createMenuForm')
            }
        })
        form.reset()

    };

    const saveLocal = useDebounce(() => {
        localStorage.setItem('createMenuForm', JSON.stringify(form.getValues()))
    }, 2000)


    const getLocal = () => {
        const local = localStorage.getItem('createMenuForm')
        if (!local) return
        form.reset(JSON.parse(local))
    }

    useEffect(() => {
        saveLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch()])


    useEffect(() => {
        getLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className='flex flex-col gap-4 w-full'>

                <div className='grid-container grid-cols-1 xl:grid-cols-[1fr,500px]'>
                    <div className='order-2 xl:order-1'>
                        <CreateUpdateMenuForm
                            form={form}
                            sections={{
                                data: section
                            }}
                            addOns={{
                                data: addOns,
                                setAddOns: setAddOns,
                                GETAddOns: GETAddOns,
                                isLoading: isAddOnsLoading
                            }}
                            printers={{
                                data: printers
                            }}
                            menu={{
                                data: menu,
                                setGETMenu: setMenu,
                                GETMenu: GETMenu,
                                isLoading: isMenuLoading,
                            }}
                            menuTypes={{
                                data: menuTypes?.data,
                                isLoading: isMenuTypesLoading,
                            }}
                            isCreateUpdateLoading={isCreateMenuLoading}
                            type="create"
                        />
                    </div>
                    <div className='flex flex-col gap-4 xl:order-2'>
                        <UploadMenuImages form={form} />
                    </div>
                </div>
            </form>
        </Form>
    )
}


