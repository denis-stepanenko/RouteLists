import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import { Button, Segment } from 'semantic-ui-react';
import imageCompression from 'browser-image-compression';

interface Image {
    type?: string;
    src: string;
}

interface Props {
    onUpload: (blob: Blob) => void;
}

export const PhotoCropper = ({ onUpload }: Props) => {

    const [image, setImage] = useState<Image | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<CropperRef>(null);
    const [file, setFile] = useState<File>();

    useEffect(() => {
        return () => {
            if (image && image.src) {
                URL.revokeObjectURL(image.src);
            }
        };
    }, [image]);

    const loadImage = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;

        if (files && files[0]) {
            setFile(files[0]);
            const blob = URL.createObjectURL(files[0]);

            setImage({
                src: blob,
                type: files[0].type
            })
        }
        event.target.value = '';
    };

    const upload = () => {
        const canvas = cropperRef.current?.getCanvas();

        if (canvas) {
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const blobFile = new File([blob], file!.name, { type: file!.type, lastModified: Date.now() })
                    
                    const compressedFile = await imageCompression(blobFile, {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 500,
                        useWebWorker: true,
                    });

                    blob = compressedFile as File;
                    onUpload(blob);
                }
            });
        }
    };

    return (
        <div className="upload-example">
            <div>
                <Button onClick={() => fileInputRef.current!.click()} content='Выбрать файл' />

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => loadImage(event)}
                    hidden />
            </div>

            <Segment style={{ height: 500 }}>
                <Cropper
                    stencilProps={{ aspectRatio: 1 }}
                    ref={cropperRef}
                    className="upload-example__cropper"
                    src={image && image.src} />
            </Segment>

            {image && (
                <Button onClick={upload} positive content='Загрузить' />
            )}
        </div>
    );
};