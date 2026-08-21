import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { ImageOff, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { optimizeImage, ImageOptions } from '../../utils/image';

interface MareImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  showBadgeOnFallback?: boolean;
  optimize?: boolean;
  optimizationOptions?: ImageOptions;
}

export const MareImage: React.FC<MareImageProps> = ({
  src,
  alt,
  className,
  aspectRatio = 'square',
  fallbackTitle = 'MARÉ',
  fallbackSubtitle = 'Catálogo Oficial',
  showBadgeOnFallback = false,
  optimize = true,
  optimizationOptions,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: ''
  }[aspectRatio];

  const isValid = storageService.isValidImageUrl(src);

  const optimizedSrc = (optimize && src) 
    ? optimizeImage(src, optimizationOptions) 
    : src;

  if (!isValid || error) {
    return (
      <div 
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 flex flex-col items-center justify-center p-4 text-center select-none border border-gray-100/80 rounded-2xl",
          aspectRatioClass,
          className
        )}
      >
        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-mare-navy/30 mb-2 border border-gray-100">
          <ImageOff className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black text-mare-navy uppercase tracking-widest leading-tight">
          {fallbackTitle}
        </span>
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
          {fallbackSubtitle}
        </span>

        {showBadgeOnFallback && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-100 text-[8px] font-bold text-mare-navy/60">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>MARÉ</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-gray-100/60", aspectRatioClass, className)}>
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 animate-pulse z-10" />
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
    </div>
  );
};
