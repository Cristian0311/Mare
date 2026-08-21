import { useCurrency } from '../contexts/CurrencyContext';

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

/**
 * Utility to share a product using Web Share API or falling back to WhatsApp/Clipboard
 */
export async function shareProduct(options: ShareOptions, currentPrice?: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { success: true, method: 'share' };
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  }

  // Fallback will be handled by the component (showing a menu)
  return { success: false, method: 'fallback' };
}

/**
 * Copies a string to the clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    return false;
  }
}

/**
 * Builds a WhatsApp share link for a specific product
 */
export function buildProductWhatsAppShare(productName: string, price: string, url: string): string {
  const message = `🛍️ Mira este producto de MARÉ\n\n*${productName}*\n💰 ${price}\n\n🔗 ${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
