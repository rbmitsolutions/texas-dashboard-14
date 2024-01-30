'use client'

import { menuSectionColumnsTable } from "./_components/section/menuSectionColumns";
import CreateMenuSectionForm from "./_components/section/createMenuSectionForm";
import { MenuSectionTables } from "./_components/section/menuSectionTable";
import { menuTypesColumnsTable } from "./_components/type/menuTypeColumns";
import CreateMenuTypeForm from "./_components/type/createMenuTypeForm";
import { MenuTypesTables } from "./_components/type/menuTypeTable";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

export default function MenuSectionsPage() {
    const {
        restaurantAllMenuSections: menuSections,
        refetchRestaurantData: toRefetchSections,
        isRestaurantDataLoading: menuSectionsLoading,
        setGETRestaurantDataParams: setMenuSections,
        GETRestaurantDataParams: GETMenuSections,
        restaurantDataError: sectionsError
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    pagination: {
                        take: 10,
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
        restaurantAllMenuTypes: menuTypes,
        isRestaurantDataLoading: menuTypesLoading,
        refetchRestaurantData: toRefetchTypes,
        setGETRestaurantDataParams: setMenuTypes,
        GETRestaurantDataParams: GETMenuTypes,
        restaurantDataError: typesError
    } = useGETRestaurantDataHooks({
        query: 'MENU_TYPE',
        defaultParams: {
            menu_types: {
                all: {
                    pagination: {
                        take: 10,
                        skip: 0
                    },
                    includes: {
                        menu: '1',
                        section: '1'
                    }
                }
            }
        }
    })

    const toRefetch = () => {
        toRefetchSections()
        toRefetchTypes()
    }


    const { createRestaurantData: createSection, isCreateRestaurantDataLoading: isCreateLoading } = usePOSTRestaurantDataHooks({
        query: 'MENU_SECTION',
        toRefetch
    })

    const { deleteRestaurantData: deleteSection } = useDELETERestaurantDataHooks({
        query: 'MENU_SECTION',
        toRefetch
    })

    const { createRestaurantData: createType, isCreateRestaurantDataLoading: isLoading } = usePOSTRestaurantDataHooks({
        query: 'MENU_TYPE',
        toRefetch
    })

    const { deleteRestaurantData: deleteType } = useDELETERestaurantDataHooks({
        query: 'MENU_TYPE',
        toRefetch
    })


    return (
        <div className='flex-col-container'>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Wrap
                    header={{
                        title: {
                            title: 'Menu Sections',
                            icon: 'Menu'
                        },
                        pagination: {
                            onPageChange: (pagination) => setMenuSections(prev => ({
                                ...prev,
                                menu_sections: {
                                    all: {
                                        ...prev.menu_sections?.all,
                                        pagination
                                    }
                                }
                            })),
                            pagination: menuSections?.pagination,
                            queryPagination: GETMenuSections?.menu_sections?.all?.pagination!,
                            isFetching: menuSectionsLoading
                        }
                    }}
                    isLoading={menuSectionsLoading}
                    error={sectionsError}
                    className='rounded-xl border-2 p-4'
                >
                    <MenuSectionTables columns={menuSectionColumnsTable({
                        onDelete: (id: string) => deleteSection({
                            menu_section: {
                                id
                            }
                        })
                    })} data={menuSections?.data} />
                </Wrap>

                <CreateMenuSectionForm createSection={createSection} isLoading={isCreateLoading} />
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Wrap
                    header={{
                        title: {
                            title: 'Menu Types',
                            icon: 'SquareStack'
                        },
                        pagination: {
                            onPageChange: (pagination) => setMenuTypes(prev => ({
                                ...prev,
                                menu_types: {
                                    all: {
                                        ...prev.menu_types?.all,
                                        pagination
                                    }
                                }
                            })),
                            pagination: menuTypes?.pagination,
                            queryPagination: GETMenuTypes?.menu_types?.all?.pagination!,
                            isFetching: menuTypesLoading
                        }
                    }}
                    actions={{
                        searchInput: {
                            value: GETMenuTypes?.menu_types?.all?.title || '',
                            onSearchChange: (title) => setMenuTypes(prev => ({
                                menu_types: {
                                    all: {
                                        ...prev.menu_types?.all,
                                        title
                                    }
                                }
                            })),
                            placeholder: 'Search by title . . .',
                            isFetching: menuTypesLoading
                        },
                        optionsPopover: {
                            isLoading: menuSectionsLoading || menuTypesLoading,
                            options: [
                                {
                                    label: 'By Section',
                                    onChange: (section_id) => setMenuTypes(prev => ({
                                        menu_types: {
                                            all: {
                                                ...prev.menu_types?.all,
                                                section_id: section_id === 'All' ? '' : section_id
                                            }
                                        }
                                    })),
                                    value: GETMenuTypes?.menu_types?.all?.section_id || '',
                                    options: menuSections?.data?.map(section => ({
                                        label: section.title,
                                        value: section.id
                                    })) || [],
                                    placeholder: 'By Section'
                                }
                            ]
                        },
                        className: 'flex justify-between gap-4'
                    }}
                    isLoading={menuTypesLoading}
                    error={typesError}
                    className='rounded-xl border-2 p-4'
                >
                    <MenuTypesTables columns={menuTypesColumnsTable({
                        onDelete: (id: string) => deleteType({
                            menu_type: {
                                id
                            }
                        })
                    })} data={menuTypes?.data} />
                </Wrap>
                <CreateMenuTypeForm createType={createType} menuSections={menuSections?.data} isLoading={isLoading} />
            </div>
        </div>
    )
}