import { UseMutateFunction } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

//libs
import Icon from "@/common/libs/lucida-icon";

//components
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RoleFormSchema, RoleFormSchemaType } from "@/common/libs/zod/forms/company/companyRoleForm";
import { rolesPermissions } from "@/common/libs/company/roles";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";
import { IDepartments } from "@/common/types/company/departaments.interface";
import { IRoles } from "@/common/types/company/companyDetails.interface";

interface CreateRoleFormProps {
    createRole?: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    onUpdate?: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    isLoading?: boolean
    departments: IDepartments[]
    role?: IRoles
}


export default function CreateRoleForm({ createRole, onUpdate, isLoading, departments, role }: CreateRoleFormProps) {
    const [isOpen, setOpen] = useState(false)

    const handleOpenChange = () => {
        setOpen(!isOpen)
        form.reset()
    }
    const form = useForm<RoleFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(RoleFormSchema),
        defaultValues: {
            departament_id: '',
            permissions: ['my_profile'],
            title: '',
        },
    });


    const onSubmitForm: SubmitHandler<RoleFormSchemaType> = async (formData) => {
        if (role) {
            onUpdate && await onUpdate({
                role: {
                    id: role.id,
                    title: formData.title,
                    departament_id: formData.departament_id,
                    permissions: formData.permissions
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        } else {
            createRole && await createRole({
                role: {
                    title: formData.title,
                    departament_id: formData.departament_id,
                    permissions: formData.permissions
                }
            }, {
                onSuccess: () => {
                    form.reset()
                }
            })
        }

    }

    const handlePermissions = (checked: CheckedState, permissions: string[]) => {
        if (checked) {
            const allPermissions = [...form.watch('permissions'), ...permissions]
            const temp: { [key: string]: boolean } = {};

            for (const p of allPermissions) {
                temp[p] = true;
            }

            const uniquePermissions = [];
            for (const p in temp) {
                uniquePermissions.push(p);
            }


            form.setValue('permissions', [...uniquePermissions])
        } else {
            form.setValue('permissions', form.watch('permissions')?.filter(
                (value) => !permissions.includes(value)
            ))
        }
    }

    useEffect(() => {
        if (role) {
            form.reset({
                title: role.title,
                departament_id: role.departament_id,
                permissions: role.permissions
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role])

    return (
        <Dialog
            onOpenChange={handleOpenChange}
            open={isOpen}
        >
            <DialogTrigger asChild>
                {role ?
                    <Button
                        size='iconExSm'
                        variant='orange'
                    >
                        <Icon name='Pencil' />
                    </Button>
                    :
                    <Button
                        leftIcon="Plus"
                        size='sm'
                        variant='orange'
                    >
                        Role
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{form.watch('title') ? form.watch('title') : 'Create Role'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="flex-col-container"
                        onSubmit={form.handleSubmit(onSubmitForm)}
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="departament_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments?.map(d => {
                                                return (
                                                    <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex-col-container px-2 my-2 max-h-[400px] overflow-auto scrollbar-thin'>
                            {rolesPermissions?.map(p => {
                                if (!p.aditional) {

                                    return (
                                        <FormField
                                            key={p.title}
                                            control={form.control}
                                            name='permissions'
                                            render={() => (
                                                <FormItem
                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={form.watch('permissions')?.includes(p.permission)}
                                                            onCheckedChange={(e) => handlePermissions(e, p?.permission_needed)}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            {p.title}
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {p.description}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }

                                if (p.aditional) {
                                    return (
                                        <FormField
                                            key={p.title}
                                            control={form.control}
                                            name='permissions'
                                            render={() => (
                                                <FormItem
                                                    className="flex-col-container gap-2 items-start rounded-md border p-4 shadow"
                                                >
                                                    <FormLabel className="text-base capitalize">{p.title}</FormLabel>
                                                    {p.aditional.map((item) => (
                                                        <FormField
                                                            key={item.title}
                                                            control={form.control}
                                                            name='permissions'
                                                            render={() => {
                                                                return (
                                                                    <FormItem
                                                                        key={item.title}
                                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={form.watch('permissions')?.includes(item.permission)}
                                                                                onCheckedChange={e => handlePermissions(e, item?.permission_needed)}
                                                                            />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                            <FormLabel>
                                                                                {item.title}
                                                                            </FormLabel>
                                                                            <FormDescription>
                                                                                {item.description}
                                                                            </FormDescription>
                                                                        </div>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }

                            })}
                        </div>
                        <div className='flex-container justify-end w-full'>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" size='sm'>
                                    Close
                                </Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                leftIcon={role ? 'Pencil' : 'Plus'}
                                size='sm'
                                disabled={isLoading}
                            >
                                {role ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}