// ── Country Data ─────────────────────────────────────────────────
// Comprehensive mapping of country codes to names, currency info, and locales.

const COUNTRY_DATA = {
  US: { name: 'United States', currency: { symbol: '$', code: 'USD', locale: 'en-US' } },
  IN: { name: 'India', currency: { symbol: '₹', code: 'INR', locale: 'en-IN' } },
  CA: { name: 'Canada', currency: { symbol: 'CA$', code: 'CAD', locale: 'en-CA' } },
  GB: { name: 'United Kingdom', currency: { symbol: '£', code: 'GBP', locale: 'en-GB' } },
  AU: { name: 'Australia', currency: { symbol: 'A$', code: 'AUD', locale: 'en-AU' } },
  EU: { name: 'Europe', currency: { symbol: '€', code: 'EUR', locale: 'de-DE' } },
  AE: { name: 'United Arab Emirates', currency: { symbol: 'د.إ', code: 'AED', locale: 'ar-AE' } },
  AR: { name: 'Argentina', currency: { symbol: 'ARS$', code: 'ARS', locale: 'es-AR' } },
  AT: { name: 'Austria', currency: { symbol: '€', code: 'EUR', locale: 'de-AT' } },
  BE: { name: 'Belgium', currency: { symbol: '€', code: 'EUR', locale: 'nl-BE' } },
  BG: { name: 'Bulgaria', currency: { symbol: 'лв', code: 'BGN', locale: 'bg-BG' } },
  BR: { name: 'Brazil', currency: { symbol: 'R$', code: 'BRL', locale: 'pt-BR' } },
  CH: { name: 'Switzerland', currency: { symbol: 'CHF', code: 'CHF', locale: 'de-CH' } },
  CL: { name: 'Chile', currency: { symbol: 'CLP$', code: 'CLP', locale: 'es-CL' } },
  CN: { name: 'China', currency: { symbol: '¥', code: 'CNY', locale: 'zh-CN' } },
  CO: { name: 'Colombia', currency: { symbol: 'COL$', code: 'COP', locale: 'es-CO' } },
  CZ: { name: 'Czech Republic', currency: { symbol: 'Kč', code: 'CZK', locale: 'cs-CZ' } },
  DE: { name: 'Germany', currency: { symbol: '€', code: 'EUR', locale: 'de-DE' } },
  DK: { name: 'Denmark', currency: { symbol: 'kr', code: 'DKK', locale: 'da-DK' } },
  EG: { name: 'Egypt', currency: { symbol: 'E£', code: 'EGP', locale: 'ar-EG' } },
  ES: { name: 'Spain', currency: { symbol: '€', code: 'EUR', locale: 'es-ES' } },
  FI: { name: 'Finland', currency: { symbol: '€', code: 'EUR', locale: 'fi-FI' } },
  FR: { name: 'France', currency: { symbol: '€', code: 'EUR', locale: 'fr-FR' } },
  GR: { name: 'Greece', currency: { symbol: '€', code: 'EUR', locale: 'el-GR' } },
  HK: { name: 'Hong Kong', currency: { symbol: 'HK$', code: 'HKD', locale: 'en-HK' } },
  HU: { name: 'Hungary', currency: { symbol: 'Ft', code: 'HUF', locale: 'hu-HU' } },
  ID: { name: 'Indonesia', currency: { symbol: 'Rp', code: 'IDR', locale: 'id-ID' } },
  IE: { name: 'Ireland', currency: { symbol: '€', code: 'EUR', locale: 'en-IE' } },
  IL: { name: 'Israel', currency: { symbol: '₪', code: 'ILS', locale: 'he-IL' } },
  IS: { name: 'Iceland', currency: { symbol: 'kr', code: 'ISK', locale: 'is-IS' } },
  IT: { name: 'Italy', currency: { symbol: '€', code: 'EUR', locale: 'it-IT' } },
  JP: { name: 'Japan', currency: { symbol: '¥', code: 'JPY', locale: 'ja-JP' } },
  KR: { name: 'South Korea', currency: { symbol: '₩', code: 'KRW', locale: 'ko-KR' } },
  LU: { name: 'Luxembourg', currency: { symbol: '€', code: 'EUR', locale: 'lb-LU' } },
  MX: { name: 'Mexico', currency: { symbol: 'MX$', code: 'MXN', locale: 'es-MX' } },
  MY: { name: 'Malaysia', currency: { symbol: 'RM', code: 'MYR', locale: 'ms-MY' } },
  NG: { name: 'Nigeria', currency: { symbol: '₦', code: 'NGN', locale: 'en-NG' } },
  NL: { name: 'Netherlands', currency: { symbol: '€', code: 'EUR', locale: 'nl-NL' } },
  NO: { name: 'Norway', currency: { symbol: 'kr', code: 'NOK', locale: 'nb-NO' } },
  NZ: { name: 'New Zealand', currency: { symbol: 'NZ$', code: 'NZD', locale: 'en-NZ' } },
  PH: { name: 'Philippines', currency: { symbol: '₱', code: 'PHP', locale: 'fil-PH' } },
  PL: { name: 'Poland', currency: { symbol: 'zł', code: 'PLN', locale: 'pl-PL' } },
  PT: { name: 'Portugal', currency: { symbol: '€', code: 'EUR', locale: 'pt-PT' } },
  QA: { name: 'Qatar', currency: { symbol: 'ر.ق', code: 'QAR', locale: 'ar-QA' } },
  RO: { name: 'Romania', currency: { symbol: 'RON', code: 'RON', locale: 'ro-RO' } },
  RU: { name: 'Russia', currency: { symbol: '₽', code: 'RUB', locale: 'ru-RU' } },
  SA: { name: 'Saudi Arabia', currency: { symbol: 'ر.س', code: 'SAR', locale: 'ar-SA' } },
  SE: { name: 'Sweden', currency: { symbol: 'kr', code: 'SEK', locale: 'sv-SE' } },
  SG: { name: 'Singapore', currency: { symbol: 'S$', code: 'SGD', locale: 'en-SG' } },
  TH: { name: 'Thailand', currency: { symbol: '฿', code: 'THB', locale: 'th-TH' } },
  TR: { name: 'Turkey', currency: { symbol: '₺', code: 'TRY', locale: 'tr-TR' } },
  TW: { name: 'Taiwan', currency: { symbol: 'NT$', code: 'TWD', locale: 'zh-TW' } },
  VN: { name: 'Vietnam', currency: { symbol: '₫', code: 'VND', locale: 'vi-VN' } },
  ZA: { name: 'South Africa', currency: { symbol: 'R', code: 'ZAR', locale: 'en-ZA' } },
};

const STORAGE_KEY = 'ehs_selected_country';
const DEFAULT_COUNTRY = 'US';

// ── Price Formatting ─────────────────────────────────────────────

/**
 * Format a numeric price with the correct currency symbol and locale.
 * Falls back to simple "$X.XX" format if Intl is unavailable.
 */
export function formatPrice(amount, countryCode) {
  const country = COUNTRY_DATA[countryCode] || COUNTRY_DATA[DEFAULT_COUNTRY];
  const { symbol, code, locale } = country.currency;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: code === 'JPY' || code === 'KRW' || code === 'VND' ? 0 : 2,
    }).format(amount);
  } catch {
    // Fallback: manual formatting
    const formatted = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
    return `${symbol}${formatted}`;
  }
}

/**
 * Get just the currency symbol for a given country code.
 */
export function getCurrencySymbol(countryCode) {
  const country = COUNTRY_DATA[countryCode] || COUNTRY_DATA[DEFAULT_COUNTRY];
  return country.currency.symbol;
}

/**
 * Get the appropriate price for a course given a country code.
 * Falls back to the course's default price if no country-specific price exists.
 */
export function getPriceForCourse(course, countryCode) {
  if (!course) return 0;

  // If we have countryPrices and a matching country, use it
  if (course.countryPrices && countryCode && course.countryPrices[countryCode] !== undefined) {
    return Number(course.countryPrices[countryCode]);
  }

  // Fallback to the default price
  return Number(course.price) || 0;
}

/**
 * Get the appropriate price for a product given a country code.
 * Falls back to the product's default price if no country-specific price exists.
 */
export function getPriceForProduct(product, countryCode) {
  if (!product) return 0;

  // If we have countryPrices and a matching country, use it
  if (product.countryPrices && countryCode && product.countryPrices[countryCode] !== undefined) {
    return Number(product.countryPrices[countryCode]);
  }

  // Fallback to the default price
  return Number(product.price) || 0;
}

// ── Country Detection ────────────────────────────────────────────

/**
 * Returns the stored country code from localStorage.
 */
export function getStoredCountry() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && COUNTRY_DATA[stored]) return stored;
  } catch {}
  return null;
}

/**
 * Save a country code to localStorage.
 */
export function setStoredCountry(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}
}

/**
 * Clear the stored country (forces re-detection).
 */
export function clearStoredCountry() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Detect the user's country via IP geolocation.
 * Uses ipapi.co (free, no API key needed).
 * Returns null if detection fails.
 */
export async function detectCountry() {
  // First, check localStorage
  const stored = getStoredCountry();
  if (stored) return stored;

  // Try IP geolocation
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    const countryCode = data.country_code;

    if (countryCode && COUNTRY_DATA[countryCode]) {
      setStoredCountry(countryCode);
      return countryCode;
    }

    return null;
  } catch {
    // Detection failed silently - user will be prompted or default used
    return null;
  }
}

/**
 * Get all available countries as an array of { code, name } objects,
 * ordered with common countries first.
 */
export function getAllCountries() {
  const common = ['US', 'IN', 'CA', 'GB', 'AU', 'EU', 'DE', 'FR', 'ES', 'IT', 'BR', 'JP'];
  const entries = Object.entries(COUNTRY_DATA);

  // Sort: common first, then alphabetically
  const sorted = entries.sort(([a], [b]) => {
    const aIsCommon = common.includes(a);
    const bIsCommon = common.includes(b);
    if (aIsCommon && !bIsCommon) return -1;
    if (!aIsCommon && bIsCommon) return 1;
    return COUNTRY_DATA[a].name.localeCompare(COUNTRY_DATA[b].name);
  });

  return sorted.map(([code, data]) => ({
    code,
    name: data.name,
    symbol: data.currency.symbol,
  }));
}

/**
 * Get country data for a given country code.
 */
export function getCountryData(countryCode) {
  return COUNTRY_DATA[countryCode] || COUNTRY_DATA[DEFAULT_COUNTRY];
}
