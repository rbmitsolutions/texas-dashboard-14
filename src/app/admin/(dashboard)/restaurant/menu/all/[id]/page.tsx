'use client'
import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

//components
import { CreateMenuFormSchema, CreateMenuFormSchemaType } from "@/common/libs/zod/forms/restaurant/createMenuForm"
import { getOptionsPriorityValueAsKeyString, getUpdateMenuInfo } from "../_components/config"
import CreateUpdateMenuForm from "../../create/_components/createUpdateMenuForm"
import UploadMenuImages from "../../create/item/_components/uploadMenuImages"
import Wrap from "@/components/common/wrap"
import { Form } from "@/components/ui/form"

//hooks
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

export default function MenuItemPage(params: { params: { id: string } }) {
    const {
        restaurantMenu: menu,
        refetchRestaurantData: refetchMenu,
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
        isCompanyDataFetching: isFilesLoading,
        setGETCompanyDataParams: setFiles,
        companyDataError: filesError,
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
        const urls = files?.data?.filter(x => x.id !== menu?.thumbnail_file_id) || []
        await updateMenu({
            menu: {
                ...getUpdateMenuInfo(formData, menu, urls)
            }
        }, {
            onSuccess: async (data) => {
                setFiles({
                    files: {
                        all: {
                            key: params?.params?.id,
                            pagination: {
                                take: 5,
                                skip: 0
                            },
                            in: {
                                key: data?.img_ids
                            }
                        }
                    }
                })
                refetchMenu()
            }
        })
    };


    useEffect(() => {
        if (menu && section) {
            form.reset({
                title: menu?.title || '',
                short_title: menu?.short_title || '',
                description: menu?.description || '',
                thumbnail: menu?.thumbnail || '',
                value: menu?.value || 0,
                profit: menu?.profit || 0,
                to_print_ids: menu?.to_print_ids || [],
                website: menu?.website,
                to_order: menu?.to_order,
                allergens: menu?.allergens || [],
                go_with_ids: menu?.go_with_ids || [],
                options_priority: getOptionsPriorityValueAsKeyString(String(menu?.options_priority)) || 'LOW',
                add_ons: menu?.add_ons?.map((item) => item?.id) || [],
                f_options: menu?.f_options?.map((item) => item?.id) || [],
            })
            if (files) {
                const urls = files?.data?.filter(x => x.id !== menu?.thumbnail_file_id).map(x => x.url)
                if (urls?.length > 0) {
                    form.setValue('images', urls)
                }
            }
        }
    }, [files, form, menu, params.params.id, section])

    useEffect(() => {
        form.setValue('mn_type_id', menu?.mn_type_id)
    }, [form, menu?.mn_type_id, section])
    return (
        <Wrap
            header={{
                title: {
                    title: 'Update Menu',
                    icon: 'ChefHat'
                }
            }}
            isLoading={isFilesLoading}
            error={filesError}
        >
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
        </Wrap>
    )
}