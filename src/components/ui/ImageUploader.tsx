import React, { useState, useRef, useCallback, useEffect } from 'react';
import { storageService, StorageBucket } from '../../services/storage';
import { Upload, X, Check, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface ImageUploaderProps {
  bucket?: StorageBucket;
  images?: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  singleMode?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket = 'products',
  images = [],
  onImagesChange,
  maxImages = 6,
  singleMode = false,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for interactive cropping tool
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [cropSrc, setCropSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const processNextInQueue = useCallback((index: number, queue: File[]) => {
    if (index >= queue.length) {
      setCropQueue([]);
      setCurrentFileIndex(0);
      setCropSrc('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const file = queue[index];
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropSrc(e.target?.result as string || '');
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
      setCurrentFileIndex(index);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setCropQueue(files);
    processNextInQueue(0, files);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Adjust handlePerformCrop to use imagesRef
  // Handle images ref to ensure we have the latest state during sequential uploads
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handlePerformCrop = async () => {
    if (!cropSrc || !croppedAreaPixels || cropQueue.length === 0) return;
    
    setUploading(true);
    setUploadProgress(`Procesando imagen ${currentFileIndex + 1} de ${cropQueue.length}...`);

    try {
      const croppedImageFile = await getCroppedImg(cropSrc, croppedAreaPixels);
      if (croppedImageFile) {
        const result = await storageService.uploadImage(croppedImageFile, bucket, `img_${Date.now()}_${currentFileIndex}`);
        
        let updatedImages: string[];
        if (singleMode) {
          updatedImages = [result.url];
        } else {
          updatedImages = [...imagesRef.current, result.url];
        }
        
        onImagesChange(updatedImages);
        imagesRef.current = updatedImages;

        // If we have more in queue, go to next
        const nextIndex = currentFileIndex + 1;
        if (nextIndex < cropQueue.length && (singleMode || updatedImages.length < maxImages)) {
          setUploading(false);
          processNextInQueue(nextIndex, cropQueue);
        } else {
          // Finish
          setUploading(false);
          setUploadProgress('');
          setCropQueue([]);
          setCurrentFileIndex(0);
          setCropSrc('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      if (singleMode) {
        onImagesChange([urlInput.trim()]);
      } else {
        if (images.length < maxImages) {
          onImagesChange([...images, urlInput.trim()]);
        }
      }
      setUrlInput('');
      setShowUrlField(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    onImagesChange([item, ...rest]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="text-[10px] font-black text-mare-navy/60 hover:text-mare-navy uppercase tracking-widest flex items-center gap-1 transition-colors"
        >
          <ImageIcon className="w-3 h-3" />
          <span>{showUrlField ? 'Ocultar entrada por URL' : '¿Prefieres ingresar una URL externa?'}</span>
        </button>

        {!singleMode && (
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {images.length} / {maxImages} Multimedia
          </span>
        )}
      </div>

      {showUrlField && (
        <div className="flex gap-2 animate-in slide-in-from-top-1 duration-200">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-mare-navy font-mono"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
          >
            Añadir
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(singleMode || images.length < maxImages) && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group bg-gray-50/50",
              isDragging 
                ? "border-mare-green bg-mare-green/5 scale-[1.02]" 
                : "border-gray-200 hover:border-mare-navy/30 hover:bg-gray-50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={!singleMode}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-mare-navy px-2 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-mare-green" />
                <span className="text-[8px] font-black uppercase tracking-wider">{uploadProgress}</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-mare-navy mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4 text-mare-navy" />
                </div>
                <span className="text-[9px] font-black text-mare-navy uppercase tracking-tight text-center px-2 leading-tight">
                  Añadir <span className="text-mare-green block sm:inline">Multimedia</span>
                </span>
              </>
            )}
          </div>
        )}

        {images.map((url, idx) => (
          <div
            key={idx}
            className={cn(
              "group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm transition-all hover:shadow-md",
              idx === 0 && !singleMode && "ring-2 ring-mare-green ring-offset-2"
            )}
          >
            <img
              src={url}
              alt={`Vista previa ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {idx === 0 && !singleMode && (
              <div className="absolute top-2 left-2 bg-mare-green text-white text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                <Check className="w-2.5 h-2.5" />
                <span>Portada</span>
              </div>
            )}
            <div className="absolute inset-0 bg-mare-navy/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              {!singleMode && idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  title="Hacer imagen principal"
                  className="p-2 rounded-xl bg-white text-mare-navy hover:bg-mare-green hover:text-white transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Eliminar imagen"
                className="p-2 rounded-xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cropQueue.length > 0 && cropSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-mare-navy/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-mare-navy text-sm uppercase tracking-wider">Ajustar Imagen {currentFileIndex + 1} de {cropQueue.length}</h3>
              <button 
                type="button" 
                onClick={() => { setCropQueue([]); setCropSrc(''); }}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-mare-navy transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[60vh] bg-gray-100">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <Button 
                type="button" 
                variant="primary" 
                className="w-full font-black uppercase text-[11px] tracking-widest bg-mare-green hover:bg-mare-green/90 text-white rounded-2xl h-12 shadow-md hover:shadow-lg transition-all"
                onClick={handlePerformCrop}
                isLoading={uploading}
              >
                Recortar y Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
