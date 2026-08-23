import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CurrencyCode, currencyConfig } from '../config/currency';
import { configService } from '../services/config';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountMN: number) => string;
  convertPrice: (amountMN: number) => number;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('mare-currency');
    return (saved as CurrencyCode) || currencyConfig.defaultCurrency;
  });
  
  const [exchangeRate, setExchangeRate] = useState(configService.getConfigSync().currency.exchangeRateUSD);

  useEffect(() => {
    const loadRate = async () => {
      try {
        const config = await configService.getConfig();
        setExchangeRate(config.currency.exchangeRateUSD);
      } catch (e) {
        console.error(e);
      }
    };
    loadRate();

    const handleConfigUpdate = async () => {
      loadRate();
    };

    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('mare-currency', code);
  };

  const exchangeRateEUR = currencyConfig.exchangeRateEUR;

  const convertPrice = useCallback((amountMN: number): number => {
    if (currency === 'MN') return amountMN;
    if (currency === 'EUR') return amountMN / exchangeRateEUR;
    return amountMN / (exchangeRate || currencyConfig.exchangeRateUSD);
  }, [currency, exchangeRate, exchangeRateEUR]);

  const formatPrice = useCallback((amountMN: number): string => {
    const amount = convertPrice(amountMN);
    
    if (currency === 'MN') {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(amount));
      return `${formatted} MN`;
    } else {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `${formatted} ${currency}`;
    }
  }, [currency, convertPrice]);

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice, 
      convertPrice,
      exchangeRate
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
