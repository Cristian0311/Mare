import { supabase } from '../lib/supabase/client';

export type StorageBucket = 'products' | 'categories' | 'avatars' | 'banners' | 'general';

export interface StorageUploadResult {
  url: string;
  path: string;
  sizeBytes: number;
  isFallbackDataUrl?: boolean;
  error?: string | null;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.82,
  format: 'image/webp'
};

class StorageService {
  /**
   * Compresses and resizes an image file in the browser before upload
   * to save bandwidth on mobile networks.
   */
  async compressAndOptimizeImage(
    file: File | Blob,
    options: ImageOptimizationOptions = {}
  ): Promise<{ blob: Blob; width: number; height: number }> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error al leer el archivo de imagen'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('El archivo no es una imagen válida'));
        img.onload = () => {
          let { width, height } = img;
          const maxWidth = opts.maxWidth || 1200;
          const maxHeight = opts.maxHeight || 1200;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo inicializar el contexto de renderizado'));
            return;
          }

          // Draw image on white background (for transparent PNGs converted to JPEG/WebP)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, width, height });
              } else {
                reject(new Error('Error al comprimir la imagen'));
              }
            },
            opts.format || 'image/webp',
            opts.quality || 0.82
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Converts a Blob/File to base64 Data URL for fallback storage
   */
  async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Uploads an image file to Supabase Storage or falls back to optimized local data URL
   */
  async uploadImage(
    file: File | Blob,
    bucket: StorageBucket = 'products',
    customFileName?: string,
    options?: ImageOptimizationOptions
  ): Promise<StorageUploadResult> {
    try {
      // 1. Compress image client-side first
      const { blob, width, height } = await this.compressAndOptimizeImage(file, options);
      const fileExt = options?.format === 'image/jpeg' ? 'jpg' : options?.format === 'image/png' ? 'png' : 'webp';
      const cleanName = (customFileName || (file instanceof File ? file.name : 'image'))
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      const timestamp = Date.now();
      const filePath = `${cleanName}_${timestamp}_${width}x${height}.${fileExt}`;

      // 2. Try Supabase upload if configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, blob, {
            contentType: blob.type,
            cacheControl: '3600000',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
          return {
            url: publicUrlData.publicUrl,
            path: filePath,
            sizeBytes: blob.size,
            isFallbackDataUrl: false
          };
        } else {
          console.warn('Supabase storage upload notice (using fallback):', error?.message);
        }
      }

      // 3. Fallback: Data URL conversion for local usage
      const dataUrl = await this.blobToDataUrl(blob);
      return {
        url: dataUrl,
        path: filePath,
        sizeBytes: blob.size,
        isFallbackDataUrl: true,
        error: null
      };
    } catch (err: any) {
      console.error('Error in storageService.uploadImage:', err);
      // Generate emergency fallback URL
      const dataUrl = await this.blobToDataUrl(file);
      return {
        url: dataUrl,
        path: `emergency_${Date.now()}.png`,
        sizeBytes: file.size,
        isFallbackDataUrl: true,
        error: err.message || 'Error al procesar la imagen'
      };
    }
  }

  /**
   * Removes an image from Supabase Storage
   */
  async deleteImage(bucket: StorageBucket, path: string): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || path.startsWith('data:')) return true;

      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) {
        console.error('Error deleting image from bucket:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error in deleteImage:', e);
      return false;
    }
  }

  /**
   * Generates a custom styled SVG placeholder data-URI for missing images
   */
  getFallbackPlaceholder(title: string = 'MARÉ', subtitle: string = 'Imagen no disponible'): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#F8FAFC"/>
      <rect x="20" y="20" width="560" height="560" rx="32" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="2"/>
      <circle cx="300" cy="260" r="64" fill="#0B1320" opacity="0.08"/>
      <path d="M280 240L300 220L320 240M300 220V280" stroke="#0B1320" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
      <text x="300" y="370" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="#0B1320" text-anchor="middle" letter-spacing="2">${title.toUpperCase()}</text>
      <text x="300" y="405" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="14" fill="#64748B" text-anchor="middle" letter-spacing="1">${subtitle}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  /**
   * Validates if a URL is accessible or well-formed
   */
  isValidImageUrl(url: string | undefined): boolean {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    if (url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return true;
    }
    return false;
  }
}

export const storageService = new StorageService();
