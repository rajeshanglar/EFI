// Currency formatting utilities - shared across components

// Currency symbol mapping
export const getCurrencySymbol = (currency: string): string => {
  const currencyMap: Record<string, string> = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'CNY': '¥',
    'SGD': 'S$',
    'AED': 'AED',
    'SAR': 'SAR',
  };
  return currencyMap[currency.toUpperCase()] || currency.toUpperCase();
};

// Get locale based on currency
export const getLocaleForCurrency = (currency: string): string => {
  const localeMap: Record<string, string> = {
    'USD': 'en-US',
    'INR': 'en-IN',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'AUD': 'en-AU',
    'CAD': 'en-CA',
    'CHF': 'de-CH',
    'CNY': 'zh-CN',
    'SGD': 'en-SG',
    'AED': 'ar-AE',
    'SAR': 'ar-SA',
  };
  return localeMap[currency.toUpperCase()] || 'en-US';
};

// Format price with currency - fully dynamic
export const formatPrice = (price: number, currency: string): string => {
  const currencyUpper = currency.toUpperCase();
  const symbol = getCurrencySymbol(currencyUpper);
  const locale = getLocaleForCurrency(currencyUpper);
  
  const formattedNumber = price.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${symbol}${formattedNumber}`;
};

