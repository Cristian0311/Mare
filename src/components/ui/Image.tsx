import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Skeleton } from './Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fallbackIconClassName?: string;
}

export function Image({ src, alt, className, containerClassName, fallbackIconClassName, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Filter out any motion-related props that might conflict if they come from parent
  const { 
    onAnimationStart: _onAnimationStart, 
    onDragStart: _onDragStart, 
    onDragEnd: _onDragEnd, 
    onDrag: _onDrag,
    ...imgProps 
  } = props as any;

  return (
    <div className={cn("relative overflow-hidden bg-gray-50 flex items-center justify-center", containerClassName)}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <Skeleton className="w-full h-full rounded-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {hasError ? (
        <div className="flex flex-col items-center justify-center text-gray-400 p-4 w-full h-full bg-gray-100/50">
          <ImageIcon className={cn("w-10 h-10 mb-2 opacity-50", fallbackIconClassName)} />
          <span className="text-xs font-medium text-center opacity-70">Imagen no disponible</span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt || "Imagen del producto"}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            filter: isLoaded ? 'blur(0px)' : 'blur(10px)'
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn("w-full h-full object-cover", className)}
          {...imgProps}
        />
      )}
    </div>
  );
}
