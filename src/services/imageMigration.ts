import { productService } from './products';
import { categoryService } from './categories';
import { advisorsService } from './advisors';
import { storageService, StorageBucket } from './storage';
import { Product, Category, Advisor } from '../types';

export interface ImageAuditReport {
  timestamp: string;
  totalImagesAnalyzed: number;
  products: {
    total: number;
    externalUrls: number;
    dataUrls: number;
    storageUrls: number;
    missingOrPlaceholders: number;
  };
  categories: {
    total: number;
    externalUrls: number;
    dataUrls: number;
    storageUrls: number;
  };
  advisors: {
    total: number;
    externalUrls: number;
    dataUrls: number;
    storageUrls: number;
  };
}

export interface MigrationProgress {
  status: 'idle' | 'running' | 'completed' | 'error';
  currentStep: string;
  totalItems: number;
  processedItems: number;
  successCount: number;
  failedCount: number;
  logs: string[];
}

class ImageMigrationService {
  /**
   * Performs an audit of all images used across products, categories, and advisors.
   */
  async auditImages(): Promise<ImageAuditReport> {
    const products = productService.getAllProductsSync();
    const categories = categoryService.getCategoriesSync();
    const advisors = advisorsService.getAllAdvisorsSync();

    const report: ImageAuditReport = {
      timestamp: new Date().toISOString(),
      totalImagesAnalyzed: 0,
      products: { total: 0, externalUrls: 0, dataUrls: 0, storageUrls: 0, missingOrPlaceholders: 0 },
      categories: { total: 0, externalUrls: 0, dataUrls: 0, storageUrls: 0 },
      advisors: { total: 0, externalUrls: 0, dataUrls: 0, storageUrls: 0 }
    };

    // Analyze Products
    products.forEach(p => {
      const imgs = p.imagenes || [];
      report.products.total += imgs.length;
      imgs.forEach(url => {
        report.totalImagesAnalyzed++;
        if (!url || url.includes('placehold.co') || url.includes('placeholder')) {
          report.products.missingOrPlaceholders++;
        } else if (url.startsWith('data:')) {
          report.products.dataUrls++;
        } else if (url.includes('supabase.co/storage')) {
          report.products.storageUrls++;
        } else if (url.startsWith('http')) {
          report.products.externalUrls++;
        }
      });
    });

    // Analyze Categories
    categories.forEach(c => {
      if (c.imagen) {
        report.categories.total++;
        report.totalImagesAnalyzed++;
        if (c.imagen.startsWith('data:')) report.categories.dataUrls++;
        else if (c.imagen.includes('supabase.co/storage')) report.categories.storageUrls++;
        else if (c.imagen.startsWith('http')) report.categories.externalUrls++;
      }
    });

    // Analyze Advisors
    advisors.forEach(a => {
      if (a.avatarUrl) {
        report.advisors.total++;
        report.totalImagesAnalyzed++;
        if (a.avatarUrl.startsWith('data:')) report.advisors.dataUrls++;
        else if (a.avatarUrl.includes('supabase.co/storage')) report.advisors.storageUrls++;
        else report.advisors.externalUrls++;
      }
    });

    return report;
  }

  /**
   * Fetches an external image URL and re-uploads it into MARÉ Storage bucket
   */
  async migrateSingleUrl(
    imageUrl: string,
    bucket: StorageBucket,
    filenamePrefix: string
  ): Promise<string> {
    if (!imageUrl || imageUrl.includes('supabase.co/storage')) {
      return imageUrl; // Already in storage
    }

    try {
      let blob: Blob;
      if (imageUrl.startsWith('data:')) {
        // Convert data URL to Blob
        const res = await fetch(imageUrl);
        blob = await res.blob();
      } else {
        // Fetch external image
        const res = await fetch(imageUrl, { mode: 'cors' });
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        blob = await res.blob();
      }

      const uploadRes = await storageService.uploadImage(blob, bucket, filenamePrefix);
      return uploadRes.url;
    } catch (e) {
      console.warn(`Could not migrate URL ${imageUrl.substring(0, 30)}...:`, e);
      return imageUrl; // Keep original as fallback
    }
  }

  /**
   * Runs batch migration for all product images
   */
  async migrateProductImages(
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<{ updatedCount: number; errors: number }> {
    const products = productService.getAllProductsSync();
    let updatedCount = 0;
    let errors = 0;

    const progress: MigrationProgress = {
      status: 'running',
      currentStep: 'Iniciando migración de imágenes de productos...',
      totalItems: products.length,
      processedItems: 0,
      successCount: 0,
      failedCount: 0,
      logs: []
    };

    if (onProgress) onProgress({ ...progress });

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      progress.currentStep = `Migrando imágen(es) de: ${product.nombre}`;
      progress.processedItems = i + 1;

      try {
        const newImages: string[] = [];
        let modified = false;

        for (let j = 0; j < product.imagenes.length; j++) {
          const originalUrl = product.imagenes[j];
          if (originalUrl && !originalUrl.includes('supabase.co/storage')) {
            const migratedUrl = await this.migrateSingleUrl(
              originalUrl,
              'products',
              `prod_${product.id}_${j}`
            );
            if (migratedUrl !== originalUrl) {
              modified = true;
            }
            newImages.push(migratedUrl);
          } else {
            newImages.push(originalUrl);
          }
        }

        if (modified) {
          await productService.updateProduct({
            ...product,
            imagenes: newImages
          });
          updatedCount++;
          progress.successCount++;
          progress.logs.push(`✅ ${product.nombre}: Imágenes optimizadas y almacenadas en MARÉ Storage`);
        }
      } catch (err: any) {
        errors++;
        progress.failedCount++;
        progress.logs.push(`❌ ${product.nombre}: ${err.message || 'Error durante la migración'}`);
      }

      if (onProgress) onProgress({ ...progress });
    }

    progress.status = 'completed';
    progress.currentStep = 'Migración finalizada con éxito';
    if (onProgress) onProgress({ ...progress });

    return { updatedCount, errors };
  }
}

export const imageMigrationService = new ImageMigrationService();
