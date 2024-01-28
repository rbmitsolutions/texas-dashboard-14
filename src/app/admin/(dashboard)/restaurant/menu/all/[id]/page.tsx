'use client'
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateMenuFormSchema, CreateMenuFormSchemaType } from "@/common/libs/zod/forms/restaurant/createMenuForm"
import { Form } from "@/components/ui/form"
import { OptionsPriority } from "@/common/types/restaurant/menu.interface"
import { useEffect, useState } from "react"
import UploadMenuImages from "../../create/item/_components/uploadMenuImages"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import CreateUpdateMenuForm from "../../create/_components/createUpdateMenuForm"

export default function MenuItemPage(params: { params: { id: string } }) {
    const {
        restaurantMenu: menu,
        setGETRestaurantDataParams: setMenu,
        GETRestaurantDataParams: GETMenu,
        isRestaurantDataFetching: isMenuLoading,
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        defaultParams: {
            menu: {
                byId: {
                    id: params?.params?.id,
                }
            }
        }
    })

    const {
        restaurantAllMenu: allMenu,
        setGETRestaurantDataParams: setAllMenu,
        GETRestaurantDataParams: GETAllMenu,
        isRestaurantDataFetching: isAllMenuLoading,
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
        companyAllFiles: files,
        setGETCompanyDataParams: setFiles,
        GETCompanyDataParams: GETFiles,
        isCompanyDataFetching: isFilesLoading,
    } = useGETCompanyDataHooks({
        query: 'FILES',
        defaultParams: {
            files: {
                all: {
                    key: params?.params?.id,
                    pagination: {
                        take: 5,
                        skip: 0
                    },
                }
            }
        },
    })

    const {
        updateRestaurantData: updateMenu,
        isUpdateRestaurantDataLoading: isMenuUpdateLoading,
    } = usePUTRestaurantDataHooks({
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
        // await createMenu({
        //     menu: {
        //         ...formData,
        //         value: Number(formData.value.toFixed(2)),
        //         options_priority: Number(OptionsPriority[formData.options_priority as keyof typeof OptionsPriority]),
        //     }
        // })
        form.reset()
    };


    useEffect(() => {
        if (menu) {
            form.reset({
                title: menu?.title,
                short_title: menu?.short_title,
                description: menu?.description,
                thumbnail: menu?.thumbnail,
                value: menu?.value,
                profit: menu?.profit,
                to_print_ids: menu?.to_print_ids,
                mn_type_id: menu?.mn_type_id,
                website: menu?.website,
                to_order: menu?.to_order,
                allergens: menu?.allergens,
                go_with_ids: menu?.go_with_ids,
                options_priority: OptionsPriority[form?.getValues('options_priority') as keyof typeof OptionsPriority],
                add_ons: menu?.add_ons?.map((item) => item?.id),
                f_options: menu?.f_options?.map((item) => item?.id),
            })
            if (files) {
                const urls = files?.data?.filter(x => x.id !== menu?.thumbnail_file_id).map(x => x.url)
                form.setValue('images', urls)
            }
        }
    }, [files, form, menu, params.params.id])



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
                                data: allMenu,
                                setGETMenu: setAllMenu,
                                GETMenu: GETAllMenu,
                                isLoading: isAllMenuLoading,
                            }}
                            menuTypes={{
                                data: menuTypes?.data,
                                isLoading: isMenuTypesLoading,
                            }}
                            isCreateUpdateLoading={isMenuUpdateLoading}
                            type="update"
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