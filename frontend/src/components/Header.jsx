import React, { useState, useEffect } from 'react';

const Header = ({ language, setLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'tr' : 'ar');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-white/20'
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative">
              <h1 className={`text-3xl font-playfair font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-800' : 'text-white drop-shadow-lg'
              }`}>
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                  منى
                </span>
                <span className={`text-lg ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
                  | Muna
                </span>
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-400 to-amber-400 rounded-full"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className={`relative group px-4 py-2 font-medium transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-pink-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'الرئيسية' : 'Ana Sayfa'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="#services"
              className={`relative group px-4 py-2 font-medium transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-pink-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'الخدمات' : 'Hizmetler'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="#appointment"
              className={`relative group px-4 py-2 font-medium transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-pink-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'حجز موعد' : 'Randevu'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`relative overflow-hidden px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 hover:from-pink-200 hover:to-rose-200'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-lg">{language === 'ar' ? '🇸🇾' : '🇹🇷'}</span>
                <span>{language === 'ar' ? 'العربية' : 'Türkçe'}</span>
              </span>
            </button>

            {/* CTA Button */}
            <a
              href="#appointment"
              className="group relative px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{language === 'ar' ? 'احجز الآن' : 'Randevu Al'}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <div className="flex flex-col space-y-4">
              <a
                href="#home"
                className="px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === 'ar' ? 'الرئيسية' : 'Ana Sayfa'}
              </a>
              <a
                href="#services"
                className="px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === 'ar' ? 'الخدمات' : 'Hizmetler'}
              </a>
              <a
                href="#appointment"
                className="px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === 'ar' ? 'حجز موعد' : 'Randevu'}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;