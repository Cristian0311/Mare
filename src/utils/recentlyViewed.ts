const RECENTLY_VIEWED_KEY = 'mare_recently_viewed_v1';
const MAX_RECENTLY_VIEWED = 15;

export function addRecentlyViewed(productId: string) {
  if (!productId) return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let list: string[] = raw ? JSON.parse(raw) : [];
    
    // Remove if already present
    list = list.filter(id => id !== productId);
    
    // Add to top
    list.unshift(productId);
    
    // Trim
    if (list.length > MAX_RECENTLY_VIEWED) {
      list = list.slice(0, MAX_RECENTLY_VIEWED);
    }
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('LocalStorage not available for recently viewed products:', e);
  }
}

export function getRecentlyViewedIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (e) {
    // Ignore
  }
}
