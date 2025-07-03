import { useState, useRef, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { User, UploadCloud } from 'lucide-react';
import { Character } from '../interfaces/Character';
import * as api from '../api/api';
import Button from './ui/Button';
import {AxiosError} from "axios";

const MAX_DIMENSION = 256;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

interface AvatarUploaderProps {
    character: Character;
}

export default function AvatarUploader({ character }: AvatarUploaderProps) {
    const queryClient = useQueryClient();
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const avatarMutation = useMutation({
        mutationFn: (file: File) => api.uploadAvatar(character.id, file),
        onSuccess: () => {
            toast.success('Avatar updated!');
            queryClient.invalidateQueries({ queryKey: ['characters'] });
            queryClient.invalidateQueries({ queryKey: ['character', character.id] });
            setPreview(null);
            setSelectedFile(null);
            setImageError(false);
        },
        onError: (error: AxiosError) => {
            toast.error(error.message || 'Upload failed.');
        },
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageError(false);

        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast.error(`File size exceeds ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB. Please choose a smaller file.`);
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const imageUrl = readerEvent.target?.result as string;
            const img = new Image();

            img.onload = () => {
                let width = img.width;
                let height = img.height;
                let wasResized = false;

                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    wasResized = true;
                    if (width > height) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    } else {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            setSelectedFile(resizedFile);
                            setPreview(canvas.toDataURL(file.type));

                            if (wasResized) {
                                toast(`Image resized to ${MAX_DIMENSION}x${MAX_DIMENSION} for optimal display.`, {
                                    icon: 'ℹ️',
                                    duration: 4000,
                                });
                            }

                        } else {
                            toast.error('Failed to resize image.');
                            setSelectedFile(null);
                            setPreview(null);
                        }
                    }, file.type, 0.9);
                } else {
                    toast.error('Could not get canvas context.');
                    setSelectedFile(null);
                    setPreview(null);
                }
            };
            img.onerror = () => {
                toast.error('Could not load image for resizing.');
                setImageError(true);
                setSelectedFile(null);
                setPreview(null);
            };
            img.src = imageUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            avatarMutation.mutate(selectedFile);
        }
    };

    const avatarSrc = `/api/Character/${character.id}/avatar`;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
                <img
                    key={character.hasAvatar ? avatarSrc : 'no-avatar'}
                    src={preview || (character.hasAvatar && !imageError ? avatarSrc : undefined)}
                    alt={character.name}
                    className="w-32 h-32 rounded-full object-cover bg-slate-700 border-2 border-slate-600"
                    onError={(e) => {
                        if (e.currentTarget.src === avatarSrc) {
                            setImageError(true);
                        }
                    }}
                />
                {!preview && (!character.hasAvatar || imageError) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-700 rounded-full border-2 border-slate-600">
                        <User className="w-16 h-16 text-slate-500" />
                    </div>
                )}
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <div className="flex gap-2">
                {/* Tooltip Wrapper */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsTooltipVisible(true)}
                    onMouseLeave={() => setIsTooltipVisible(false)}
                >
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloud className="w-4 h-4 mr-2" />
                        Choose Image
                    </Button>

                    {/* Tooltip Content */}
                    {isTooltipVisible && (
                        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap opacity-0 animate-fade-in-up">
                            Max size: {MAX_DIMENSION}x{MAX_DIMENSION}px, {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB
                            <div className="absolute left-1/2 translate-x-[-50%] top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-700"></div>
                        </div>
                    )}
                </div>

                {preview && selectedFile && (
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        isLoading={avatarMutation.isPending}
                        loadingText="Uploading..."
                    >
                        Save Avatar
                    </Button>
                )}
            </div>

            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}