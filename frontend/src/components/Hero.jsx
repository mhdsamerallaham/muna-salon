import React from 'react';

const Hero = ({ language = 'ar' }) => {
  const whatsappMessage = language === 'ar'
    ? 'مرحباً منى، أريد حجز موعد.'
    : 'Merhaba Muna, randevu almak istiyorum.';

  const whatsappUrl = `https://wa.me/905366785849?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Beautiful Background Image */}
      <div className="absolute inset-0">
        <video
          src="/videos/hero/hero-main.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero/hero-main.mp4" type="video/mp4" />
          {/* Fallback resim */}
          <img
            src="/images/hero/hero-main.jpg"
            alt="Professional female hairstylist at work"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-rose-800/70 to-amber-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-200/30 to-yellow-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
              {language === 'ar' ? 'منى' : 'Muna'}
            </span>
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-semibold text-white/90 drop-shadow-lg">
            {language === 'ar' ? 'خدمات تجميل منزلية للسيدات' : 'Evlere Özel Kadın Kuaför Hizmeti'}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 font-poppins max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          {language === 'ar'
            ? 'نأتي إليك في منزلك بأفضل خدمات التجميل والعناية، راحة وخصوصية تامة في بيئتك المفضلة'
            : 'En kaliteli güzellik ve bakım hizmetlerini evinizin konforunda, tamamen özel ve rahat bir ortamda sunuyoruz'
          }
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <a
            href="#appointment"
            className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            <span className="relative z-10">
              {language === 'ar' ? 'احجز موعدك الآن' : 'Hemen Randevu Al'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-semibold rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            {language === 'ar' ? 'واتساب' : 'WhatsApp'}
          </a>
        </div>

        {/* Stats or Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-semibold text-white mb-1">
              {language === 'ar' ? 'خدمة منزلية' : 'Ev Hizmeti'}
            </h3>
            <p className="text-white/70 text-sm">
              {language === 'ar' ? 'راحة منزلك' : 'Evinizin Konforunda'}
            </p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">👩‍💇</div>
            <h3 className="font-semibold text-white mb-1">
              {language === 'ar' ? 'خدمات نسائية خاصة' : 'Kadınlara Özel'}
            </h3>
            <p className="text-white/70 text-sm">
              {language === 'ar' ? 'خصوصية تامة' : 'Tam Mahremiyet'}
            </p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-semibold text-white mb-1">
              {language === 'ar' ? 'أدوات احترافية' : 'Profesyonel Ekipman'}
            </h3>
            <p className="text-white/70 text-sm">
              {language === 'ar' ? 'أحدث الأجهزة' : 'En Yeni Aletler'}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;