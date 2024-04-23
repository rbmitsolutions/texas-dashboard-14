import { cn } from "@/common/libs/shadcn/utils";
import Resizer from "react-image-file-resizer";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import Image from "next/image";

//components
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

//libs
import Icon from "@/common/libs/lucida-icon";

//utils
import getCroppedImg from "./cropImage";

interface ImageCropperProps {
    cropShape?: 'round' | 'rect'
    image?: string
    cropSize: { width: number, height: number }
    onSave?: (image: string) => Promise<void>
    onRemove?: () => Promise<void>
    children: React.ReactNode
}

//todo add rotation
export default function ImageCropper({ image, cropSize, cropShape = 'rect', onSave, onRemove, children }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    // const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [newImage, setNewImage] = useState<string | ArrayBuffer | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onOpenChange = useCallback(() => {
        if (isOpen) {
            setNewImage(null)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            // setRotation(0)
            setCroppedAreaPixels(null)
        }
        setIsOpen(!isOpen)
    }, [isOpen])

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);


    const createPreviewFile = async (
        e: any,
    ) => {
        setIsLoading(true);
        const objectFile = new FormData();
        const finishedFile = e.target.files[0];
        objectFile.append("file", finishedFile);
        const reader = new FileReader();
        if (finishedFile) {
            await reader?.readAsDataURL(finishedFile);
            reader.onloadend = () => {
                setNewImage(reader?.result);
                setIsLoading(false);
            };
        } else {
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        setIsLoading(true);
        onRemove && await onRemove().finally(() => {
            setIsLoading(false);
            onOpenChange()
        })
    }

    const handleCroppedImage = async () => {
        setIsLoading(true);
        const { file } = await getCroppedImg(
            newImage,
            croppedAreaPixels,
            0 // rotation
        );

        const compressedFile = await new Promise((resolve) =>
            Resizer.imageFileResizer(
                file,
                1200, // largura máxima permitida
                800, // altura máxima permitida
                "WEBP", // formato de saída
                90, // qualidade da imagem (0-100)
                0, // rotação em graus
                (resizedFile) => resolve(resizedFile),
                "base64" // tipo de retorno
            )
        );
        const compressed = await compressedFile

        onSave && await onSave(compressed as string).finally(() => {
            setIsLoading(false);
            onOpenChange()
        })
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger className="relative group" onClick={() => setIsOpen(true)}>
                <div className={cn('hidden justify-center items-center absolute z-10 w-full h-full cursor-pointer group-hover:flex group-hover:bg-foreground/20', cropShape === 'round' && 'rounded-full')}>
                    <Icon name='Camera' />
                </div>
                {children}
            </DialogTrigger>
            <DialogContent className="flex-container justify-center max-w-screen py-10 sm:max-w-[600px]">
                {(image && !newImage) &&
                    <div className='flex items-center justify-center relative w-[80vw] h-[300px] rounded-xl bg-foreground/5 sm:w-[500px]'>
                        <Image
                            src={image}
                            alt='image cropper'
                            width={200}
                            height={200}
                        />
                    </div>
                }



                {(!image && !newImage) &&
                    <label className='flex items-center justify-center relative w-[80vw] h-[300px] rounded-xl bg-foreground/5 sm:w-[500px] cursor-pointer'>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={createPreviewFile}
                        />
                        <h1 className='text-3xl font-semibold text-gray-500'>Upload Image</h1>
                    </label>
                }
                {newImage &&
                    <>
                        <div className='relative w-[80vw] h-[300px] rounded-xl bg-foreground/5 overflow-hidden sm:w-[500px]'>
                            <Cropper
                                cropSize={cropSize}
                                image={newImage as string}
                                crop={crop}
                                zoom={zoom}
                                cropShape={cropShape}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                    </>
                }
                {onSave &&
                    <DialogFooter className='mt-4'>
                        <Button
                            disabled={!image}
                            isLoading={isLoading}
                            onClick={handleDelete}
                            leftIcon="Trash"
                            variant='destructive'
                        >
                            Remove
                        </Button>
                        <div className='flex gap-4 w-full justify-end'>
                            <Button
                                variant='secondary'
                                disabled={isLoading}
                                isLoading={isLoading}
                                leftIcon='Upload'
                                className='pr-0 pl-2 py-0'
                            >
                                <label htmlFor="fileInput" className=' h-full pr-4 py-2 cursor-pointer rounded-lg'>Upload</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={createPreviewFile}
                                />
                            </Button>
                            <Button
                                disabled={isLoading || !newImage}
                                isLoading={isLoading}
                                onClick={handleCroppedImage}
                                leftIcon="Save"
                            >
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    );
};