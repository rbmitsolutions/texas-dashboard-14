import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//libs
import { CreateSupplierTypeFormSchema, CreateSupplierTypeFormSchemaType } from "@/common/libs/zod/forms/restaurant/createSupplierForm";

//components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//interfaces

interface NewSupplierDialogProps {
}

export default function NewSupplierDialog({ }: NewSupplierDialogProps) {

    const form = useForm<CreateSupplierTypeFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(CreateSupplierTypeFormSchema),
        defaultValues: {
            title: '',
            address: ''
        },
    });

    const onSubmitForm: SubmitHandler<CreateSupplierTypeFormSchemaType> = async (formData) => {
        console.log(formData)
        // await addSection({
        //     section: {
        //         ...formData
        //     }
        // }, {
        //     onSuccess: () => {
        //         form.reset()
        //     }
        // })
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    leftIcon="Plus"
                    variant='orange'
                >
                    New Supplier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Create</DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className="flex-col-container"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            leftIcon='Plus'
                            className='self-end'
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}