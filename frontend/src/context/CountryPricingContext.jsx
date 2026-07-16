import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  getStoredCountry,
  setStoredCountry,
  clearStoredCountry,
  getCountryData,
  getPriceForCourse,
  formatPrice as formatPriceUtil,
} from '../utils/pricing';
import { useAuth } from './AuthContext';

const CountryPricingContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Parse a Google locale string (e.g. "en-US", "hi-IN", "en-GB")
 * into a country code if it matches our supported countries.
 * Returns null if no valid country can be extracted.
 */
function parseCountryFromLocale(locale) {
  if (!locale || typeof locale !== 'string') return null;

  // Locale is typically "language-REGION" or just "language"
  const parts = locale.split('-');
  if (parts.length < 2) return null;

  const region = parts[parts.length - 1].toUpperCase();
  // Check if the region code is a valid country in our data
  const countryData = getCountryData(region);
  if (countryData) return region;

  return null;
}

export function CountryPricingProvider({ children }) {
  const { user, token, isLoggedIn, updateUserCountry } = useAuth();
  const [countryCode, setCountryCode] = useState(() => getStoredCountry() || null);
  const [showSelector, setShowSelector] = useState(false);
  const prevIsLoggedIn = useRef(isLoggedIn);

  // Sync user's country from backend when auth state changes
  useEffect(() => {
    // Detect logout — reset to default USD pricing
    if (prevIsLoggedIn.current && !isLoggedIn) {
      setCountryCode(null);
      clearStoredCountry();
      prevIsLoggedIn.current = isLoggedIn;
      return;
    }
    prevIsLoggedIn.current = isLoggedIn;

    if (isLoggedIn && user?.country && user.country !== '') {
      // User has a country in the DB — use it
      setCountryCode(user.country);
      setStoredCountry(user.country);
    } else if (isLoggedIn && !user?.country) {
      // User is logged in but has no country set — show selector
      const stored = getStoredCountry();
      if (!stored) {
        setShowSelector(true);
      }
    }
  }, [isLoggedIn, user?.country]);

  /**
   * Save country to the backend database.
   */
  const saveCountryToBackend = useCallback(async (code) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/auth/country`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ country: code }),
      });
    } catch (err) {
      console.error('Failed to save country to backend:', err);
    }
  }, [token]);

  /**
   * Try to set the country from a Google locale string.
   * Returns true if a valid country was found and set, false otherwise.
   */
  const trySetCountryFromLocale = useCallback((locale) => {
    const parsed = parseCountryFromLocale(locale);
    if (parsed) {
      setCountryCode(parsed);
      setStoredCountry(parsed);
      return true;
    }
    return false;
  }, []);

  /**
   * Show the country selector modal (triggered after Google sign-in).
   */
  const showCountrySelector = useCallback(() => {
    setShowSelector(true);
  }, []);

  const changeCountry = useCallback(async (code) => {
    setCountryCode(code);
    setStoredCountry(code);
    setShowSelector(false);
    // Update AuthContext so user.country reflects the selected country immediately
    if (updateUserCountry) {
      updateUserCountry(code);
    }
    // Persist to backend if logged in
    await saveCountryToBackend(code);
  }, [saveCountryToBackend, updateUserCountry]);

  const getPrice = useCallback(
    (course) => getPriceForCourse(course, countryCode),
    [countryCode]
  );

  const formatPrice = useCallback(
    (amount) => formatPriceUtil(amount, countryCode),
    [countryCode]
  );

  const countryData = getCountryData(countryCode);
  const currencySymbol = countryData?.currency?.symbol || '$';

  return (
    <CountryPricingContext.Provider
      value={{
        countryCode,
        countryData,
        showSelector,
        setShowSelector,
        changeCountry,
        getPrice,
        formatPrice,
        currencySymbol,
        trySetCountryFromLocale,
        showCountrySelector,
      }}
    >
      {children}
    </CountryPricingContext.Provider>
  );
}

export function useCountryPricing() {
  const ctx = useContext(CountryPricingContext);
  if (!ctx) throw new Error('useCountryPricing must be used within CountryPricingProvider');
  return ctx;
}
