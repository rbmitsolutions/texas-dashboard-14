import { cn } from "@/common/libs/shadcn/utils";
import Image from "next/image";

//components
import { ExtendedCreateMenuFormType } from "../../_components/createUpdateMenuForm";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import ImageCropper from "@/components/common/imageCropper";
import TransferMenuImages from "./transferMenuImages";
import { ImagesPath } from "@/common/types/imgs";

export interface UploadMenuImagesProps {
    form: ExtendedCreateMenuFormType
}


export default function UploadMenuImages({ form }: UploadMenuImagesProps) {

    const onImageUpload = async (image: string, as: 'thumbnail' | 'image', index?: number): Promise<void> => {
        if (as === 'image' && index !== undefined) {
            const images = form.getValues('images') || ['', '', '']
            images[index] = image
            form.setValue('images', images)
            return
        }
        form.setValue('thumbnail', image)
    }

    const onImageRemove = async (as: 'thumbnail' | 'image', index?: number): Promise<void> => {
        if (as === 'image' && index !== undefined) {
            const images = form.getValues('images') || ['', '', '']
            images[index] = ''
            form.setValue('images', images)
            return
        }
        form.setValue('thumbnail', '')
    }

    return (
        <div className='flex-col-container'>
            <div className='flex-container rounded-lg border-2 p-4'>
                <div className='flex-col-container'>
                    <ImageCropper
                        cropShape="rect"
                        image={form.watch('thumbnail')}
                        cropSize={{ width: 250, height: 250 }}
                        onSave={(image) => onImageUpload(image, 'thumbnail')}
                        onRemove={() => onImageRemove('thumbnail')}
                    >
                        <div className='r-2 w-40 h-40 rounded-lg border-dashed border-2'>
                            <Image
                                alt="menu thumbnail"
                                src={form.watch('thumbnail') as string || ImagesPath['NO_IMAGE']}
                                layout='fill'
                                objectFit='cover'
                                className={cn('rounded-md', !form.watch('thumbnail') && 'grayscale opacity-20')}
                            />
                        </div>
                    </ImageCropper>
                </div>
                <div className='flex-col-container gap-2'>
                    <h1 className='text-xl font-bold capitalize'>{form.watch('title')?.toLowerCase() || 'New menu Item'}
                    </h1>
                    <p className='text-justify line-clamp-3 break-all'>{form.watch('description')}</p>
                    <strong className='text-xl'>{convertCentsToEuro(form.watch('value') || 0)}</strong>
                    <TransferMenuImages/>
                </div>
            </div>
            <div className='flex-container items-center justify-center flex-wrap rounded-lg border-2 p-4'>
                {[...Array(3)].map((_, i) => {
                    const image = form.watch('images') || []
                    return (
                        <div key={i} className='flex-1'>
                            <ImageCropper
                                cropShape="rect"
                                image={image[i] as any || ''}
                                cropSize={{ width: 400, height: 250 }}
                                onSave={(image) => onImageUpload(image, 'image', i)}
                                onRemove={() => onImageRemove('image', i)}
                            >
                                <div className='r-2 w-32 h-20 rounded-lg border-dashed border-2'>
                                    <Image
                                        alt="menu thumbnail"
                                        src={image[i] || '/img/noimage.jpg'}
                                        layout='fill'
                                        objectFit='cover'
                                        className={cn('rounded-md', !image[i] && 'grayscale opacity-20')}
                                    />
                                </div>
                            </ImageCropper>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}