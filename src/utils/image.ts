import { isConfigured } from '../lib/supabase/client';

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Optimizes an image URL using Supabase Image Transformation.
 * If the app is not configured with Supabase or the URL is external, returns the original URL.
 */
export function optimizeImage(url: string, options: ImageOptions = {}): string {
  if (!url) return '';
  if (!isConfigured) return url;
  
  // Only optimize Supabase storage URLs
  const isSupabaseUrl = url.includes('.supabase.co/storage/v1/object/public/');
  if (!isSupabaseUrl) return url;

  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    resize = 'cover'
  } = options;

  const params = new URLSearchParams();
  if (width) params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  params.set('quality', quality.toString());
  if (format !== 'origin') params.set('format', format);
  params.set('resize', resize);

  // Supabase transformation URL format:
  // [project-url]/storage/v1/render/image/public/[bucket]/[path]?[params]
  
  try {
    const baseUrl = url.split('/storage/v1/object/public/')[0];
    const path = url.split('/storage/v1/object/public/')[1];
    
    return `${baseUrl}/storage/v1/render/image/public/${path}?${params.toString()}`;
  } catch (e) {
    return url;
  }
}
