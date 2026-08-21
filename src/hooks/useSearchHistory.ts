import { useState, useEffect } from 'react';

const HISTORY_KEY = 'mare_search_history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  }, []);

  const addSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setHistory(prev => {
      // Remove if exists to push to top
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      const newHistory = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save search history', e);
      }
      
      return newHistory;
    });
  };

  const removeSearch = (term: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(t => t !== term);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save search history', e);
      }
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear search history', e);
    }
  };

  return { history, addSearch, removeSearch, clearHistory };
}
