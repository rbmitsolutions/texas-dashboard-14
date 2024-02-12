'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignaturePad from "react-signature-canvas";
import { useRef } from "react";

//components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrap from "@/components/common/wrap"

//libs
import { UserContractFormSchema, UserContractFormSchemaType } from "@/common/libs/zod/forms/user/contract.form";
import Icon from "@/common/libs/lucida-icon";

//interface 
import { IFiles } from "@/common/types/company/files.interface"

interface ContractComponentProps {
    contract: IFiles
}

export default function ContractComponent({ contract }: ContractComponentProps): JSX.Element {
    const sigCanvas = useRef(null);
    const form = useForm<UserContractFormSchemaType>({
        mode: "onChange",
        resolver: zodResolver(UserContractFormSchema),
        defaultValues: {
            address: '',
            contact_number: '',
            pps_number: '',
            signature: ''
        },
    });

    const formatIntoPng = () => {
        if (sigCanvas.current) {
            const dataURL = (sigCanvas.current as any).toDataURL();
            return dataURL;
        }
    };

    const onSubmitForm: SubmitHandler<UserContractFormSchemaType> = (formData) => {
        console.log(formData)
        // form.reset()
    };

    return (
        <Wrap
            header={{
                title: {
                    title: 'Contract',
                    icon: 'FileCheck'
                }
            }}
        >
            <iframe
                src={contract?.url}
                width='100%'
                height='100%'
                style={{
                    minHeight: "500px",
                }}
            />
            <Form {...form}>
                <form
                    className='flex-col-container gap-6 mt-8 max-w-lg m-auto'
                    onSubmit={form.handleSubmit(onSubmitForm)}>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contact_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contact Number" type='tel' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pps_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PPS Numer</FormLabel>
                                <FormControl>
                                    <Input placeholder="PPS Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className=' flex-col items-center md:flex'>
                        <FormField
                            control={form.control}
                            name="signature"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between items-center'>
                                        Signature
                                        <Button
                                            variant='destructive'
                                            type='button'
                                            size='iconExSm'
                                            onClick={() => {
                                                (sigCanvas.current as any).clear()
                                                field.onChange('')
                                            }}
                                        >
                                            <Icon name='Trash' />
                                        </Button>
                                    </FormLabel>
                                    <FormControl >
                                        <div className='rounded-2xl w-full max-w-[450px] background-soft dark:bg-foreground/20'>
                                            <SignaturePad
                                                ref={sigCanvas}
                                                onEnd={() => field.onChange(formatIntoPng())}
                                                penColor="black"
                                                canvasProps={{
                                                    style: {
                                                        border: "1px solid",
                                                        borderRadius: "20px",
                                                        width: '100%',
                                                        maxWidth: '450px',
                                                        height: '200px'
                                                    },
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type='submit'
                        leftIcon="Save"
                    >
                        Save
                    </Button>
                </form>
            </Form>
        </Wrap>
    )
}