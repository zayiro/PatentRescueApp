// utils/priceUtils.ts
export const formatPrice = (
  price: number | string,
  currency: 'COP' | 'MXN' | 'USD' = 'COP',
  locale: string = 'es-CO'
): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

// 🇨🇴 Colombia
export const formatCOP = (price: number | string): string => {
  return formatPrice(price, 'COP', 'es-CO');
};

// 🇲🇽 México
export const formatMXN = (price: number | string): string => {
  return formatPrice(price, 'MXN', 'es-MX');
};

// 🌎 Internacional
export const formatUSD = (price: number | string): string => {
  return formatPrice(price, 'USD', 'en-US');
};