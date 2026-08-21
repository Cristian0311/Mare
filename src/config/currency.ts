export type CurrencyCode = 'MN' | 'USD';

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
  flag: string;
}

export const currencies: Record<CurrencyCode, Currency> = {
  MN: {
    code: 'MN',
    label: 'MN',
    symbol: 'MN',
    flag: '🇨🇺',
  },
  USD: {
    code: 'USD',
    label: 'USD',
    symbol: 'USD',
    flag: '🇺🇸',
  },
};

export const currencyConfig = {
  baseCurrency: 'MN' as CurrencyCode,
  exchangeRateUSD: 565, // 1 USD = 565 MN
  defaultCurrency: 'MN' as CurrencyCode,
};
