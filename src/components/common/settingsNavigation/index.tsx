"use client"
import * as React from "react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/common/libs/shadcn/utils"
import Link from "next/link"

interface NavigationProps {
    title: string
    components: { title: string; href: string; description: string }[]
}

export interface SettingsNavigationProps {
    navigation: NavigationProps[]
}

export default function SettingsNavigation({ navigation }: SettingsNavigationProps) {
    return (
        <NavigationMenu >
            <NavigationMenuList className='flex justify-start gap-2 flex-wrap'>
                {navigation?.map(nav => {
                    return (
                        <NavigationMenuItem key={nav?.title}>
                            <NavigationMenuTrigger className='bg-foreground/5'>{nav?.title}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] " >
                                    {nav?.components?.map(component => {
                                        return (
                                            <ListItem
                                                className='bg-foreground/5'
                                                key={component.href}
                                                title={component.title}
                                                href={component.href}
                                            >
                                                {component.description}
                                            </ListItem>
                                        )
                                    })}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <Link
                href={props.href as string}
                ref={ref}
                className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    className
                )}
                {...props}
            >
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {children}
                </p>
            </Link>
        </li>
    )
})
ListItem.displayName = "ListItem"
