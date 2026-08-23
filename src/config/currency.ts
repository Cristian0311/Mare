export type CurrencyCode = 'MN' | 'USD' | 'EUR';

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
  EUR: {
    code: 'EUR',
    label: 'EUR',
    symbol: 'EUR',
    flag: '🇪🇺',
  },
};

export const currencyConfig = {
  baseCurrency: 'MN' as CurrencyCode,
  exchangeRateUSD: 565, // 1 USD = 565 MN
  exchangeRateEUR: 580, // 1 EUR = 580 MN
  defaultCurrency: 'MN' as CurrencyCode,
};
