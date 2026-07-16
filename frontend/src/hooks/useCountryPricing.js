import { useState, useEffect, useCallback } from 'react';
import {
  detectCountry,
  getStoredCountry,
  setStoredCountry,
  getCountryData,
  getPriceForCourse,
  formatPrice as formatPriceUtil,
  getCurrencySymbol,
} from '../utils/pricing';

/**
 * useCountryPricing
 *
 * Hook that manages country detection, provides pricing utilities,
 * and exposes a "show selector" state for the country selection modal.
 *
 * Usage:
 *   const { countryCode, isLoading, showSelector, setShowSelector, changeCountry, formatPrice, getPrice, currencySymbol } = useCountryPricing();
 */
export default function useCountryPricing() {
  const [countryCode, setCountryCode] = useState(() => getStoredCountry() || null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);

  // Auto-detect country on mount
  useEffect(() => {
    let mounted = true;

    const runDetection = async () => {
      // If already stored, skip detection
      const stored = getStoredCountry();
      if (stored) {
        if (mounted) {
          setCountryCode(stored);
          setIsLoading(false);
        }
        return;
      }

      // Attempt IP detection
      const detected = await detectCountry();
      if (mounted) {
        if (detected) {
          setCountryCode(detected);
        } else {
          // Detection failed — show the country selector modal
          setShowSelector(true);
        }
        setIsLoading(false);
      }
    };

    runDetection();

    return () => {
      mounted = false;
    };
  }, []);

  // Change and persist country
  const changeCountry = useCallback((code) => {
    setCountryCode(code);
    setStoredCountry(code);
    setShowSelector(false);
  }, []);

  // Get formatted price for a course in the selected country
  const getPrice = useCallback(
    (course) => getPriceForCourse(course, countryCode),
    [countryCode]
  );

  // Format a number with the selected country's currency
  const formatPrice = useCallback(
    (amount) => formatPriceUtil(amount, countryCode),
    [countryCode]
  );

  // Get currency symbol
  const currencySymbol = getCurrencySymbol(countryCode);

  // Get full country data
  const countryData = getCountryData(countryCode);

  return {
    countryCode,
    countryData,
    isLoading,
    showSelector,
    setShowSelector,
    changeCountry,
    getPrice,
    formatPrice,
    currencySymbol,
  };
}
