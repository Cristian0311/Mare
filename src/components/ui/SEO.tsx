import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { configService } from '../../services/config';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noindex?: boolean;
  structuredData?: object;
  productData?: {
    price?: number;
    currency?: string;
    availability?: string;
  };
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  noindex = false,
  structuredData,
  productData
}: SEOProps) {
  const [seoSettings, setSeoSettings] = useState<any>(null);
  const siteName = 'MARÉ';

  useEffect(() => {
    const loadSeo = async () => {
      const settings = await configService.getSeoSettings();
      if (settings) setSeoSettings(settings);
    };
    loadSeo();
  }, []);

  const defaultTitle = seoSettings?.title || `${siteName} — Tu tienda online en Cuba`;
  const defaultDescription = seoSettings?.description || 'Encuentra todo lo que buscas en MARÉ. Tu tienda online de confianza con ofertas, categorías y los mejores productos.';
  const defaultUrl = 'https://mare-a8w2.onrender.com';
  const defaultImage = `${defaultUrl}/icon.svg`; 

  const seoTitle = title ? `${siteName} | ${title}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = seoSettings?.keywords || '';
  
  // Use provided canonical, or fallback to the real domain path, without query params
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const seoUrl = canonical || `${defaultUrl}${currentPath}`;
  
  const seoImage = ogImage || defaultImage;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}
      {/* Canonical */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Language */}
      <html lang="es" />

      {/* Open Graph */}
      <meta property="og:locale" content="es_CU" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:type" content={ogType} />

      {/* Product specifics */}
      {ogType === 'product' && productData && (
        <>
          {productData.price && <meta property="product:price:amount" content={productData.price.toString()} />}
          {productData.currency && <meta property="product:price:currency" content={productData.currency} />}
          {productData.availability && <meta property="product:availability" content={productData.availability} />}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
