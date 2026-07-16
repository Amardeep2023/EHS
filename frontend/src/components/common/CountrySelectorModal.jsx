import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search } from 'lucide-react';
import { getAllCountries, getCountryData } from '../../utils/pricing';

export default function CountrySelectorModal({ isOpen, onSelect }) {
  const [search, setSearch] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const countries = getAllCountries();

  const filtered = search
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  const handleSelect = (code) => {
    setSelectedCode(code);
    onSelect(code);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — compulsory, no close on click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Modal — no close button, user must pick a country */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-espresso/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Globe size={24} className="text-gold" />
                  </div>
                  <div>
                    <h2 className="font-boska text-xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                      Welcome! Select Your Country
                    </h2>
                    <p className="text-xs text-secondary mt-0.5">
                      Choose your country to see prices in your local currency. This helps us show you the correct pricing.
                    </p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/50" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full rounded-xl border border-espresso/10 bg-cream/50 pl-10 pr-4 py-2.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="py-10 text-center text-sm text-secondary">
                    No countries found matching "{search}"
                  </div>
                ) : (
                  filtered.map((country) => {
                    const data = getCountryData(country.code);
                    const isSelected = selectedCode === country.code;
                    return (
                      <button
                        key={country.code}
                        onClick={() => handleSelect(country.code)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-gold/10 border border-gold/30'
                            : 'hover:bg-cream/70 border border-transparent'
                        }`}
                      >
                        {/* Flag emoji */}
                        <span className="text-xl flex-shrink-0">
                          {String.fromCodePoint(
                            ...country.code.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-espresso truncate">
                            {country.name}
                          </p>
                          <p className="text-xs text-secondary">
                            {country.code} · {data?.currency?.symbol}{data?.currency?.code}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-espresso">
                          {country.symbol}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-espresso/5 bg-cream/30">
                <p className="text-xs text-secondary/60 text-center">
                  Please select your country to continue. Your selection will be saved for future visits.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
