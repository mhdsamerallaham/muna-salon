import React, { useEffect, useRef, useState } from 'react';

const Services = ({ language = 'ar' }) => {
  const videoRefs = useRef([]);

  const VideoComponent = ({ service, index }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isPlaying) {
              // Delay video start to reduce simultaneous loading
              setTimeout(() => {
                video.play().catch(() => {});
                setIsPlaying(true);
              }, index * 200); // Stagger video starts
            } else if (!entry.isIntersecting && isPlaying) {
              video.pause();
              setIsPlaying(false);
            }
          });
        },
        { threshold: 0.5, rootMargin: '50px' }
      );

      observer.observe(video);
      return () => observer.unobserve(video);
    }, [index, isPlaying]);

    return (
      <video
        ref={videoRef}
        src={service.image}
        loop
        muted
        playsInline
        preload="none"
        loading="lazy"
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02] bg-gradient-to-br from-gray-100 to-gray-50"
        style={{
          transform: 'translateZ(0)',
          willChange: 'auto',
          imageRendering: 'optimizeSpeed'
        }}
        onLoadStart={() => console.log(`Video ${index + 1} loading started`)}
        onCanPlay={() => console.log(`Video ${index + 1} can play`)}
        onError={() => console.log(`Video ${index + 1} error`)}
      >
        <source src={service.image} type="video/mp4" />
      </video>
    );
  };

  const services = [
    {
      id: 1,
      title: {
        ar: 'قص الشعر',
        tr: 'Saç Kesimi'
      },
      description: {
        ar: 'قصات عصرية ومتنوعة في راحة منزلك، نأتي بأدواتنا المتخصصة لنمنحك أجمل الإطلالات',
        tr: 'Evinizin konforunda profesyonel saç kesimi, uzman ekipmanlarımızla en güzel görünümler'
      },
      image: '/videos/services/service-haircut.mp4',
      gradient: 'from-pink-400 to-rose-400',
      icon: '✂️'
    },
    {
      id: 2,
      title: {
        ar: 'صبغة الشعر',
        tr: 'Saç Boyama'
      },
      description: {
        ar: 'أحدث ألوان الصبغات الطبيعية في منزلك، بخصوصية تامة ومنتجات إيطالية فاخرة',
        tr: 'Evinizde en son doğal saç boyama teknikleri, tamamen özel ortamda lüks İtalyan ürünlerle'
      },
      image: '/videos/services/service-coloring.mp4',
      gradient: 'from-purple-400 to-pink-400',
      icon: '🎨'
    },
    {
      id: 3,
      title: {
        ar: 'تسريح الشعر',
        tr: 'Saç Şekillendirme'
      },
      description: {
        ar: 'تسريحات أنيقة في بيتك للمناسبات الخاصة، راحة وجمال بلا حدود',
        tr: 'Evinizde özel günleriniz için zarif şekillendirme, sınırsız rahatlık ve güzellik'
      },
      image: '/videos/services/service-styling.mp4',
      gradient: 'from-amber-400 to-orange-400',
      icon: '💫'
    },
    {
      id: 4,
      title: {
        ar: 'تسريح العرائس',
        tr: 'Gelin Saçı'
      },
      description: {
        ar: 'إعداد العروس الكامل في منزلها، تسريحة وماكياج ملكي في أجواء حميمة',
        tr: 'Evinizdeki özel atmosferde tam gelin hazırlığı, kraliçe saçı ve makyajı'
      },
      image: '/videos/services/service-bridal.mp4',
      gradient: 'from-rose-400 to-pink-400',
      icon: '👑'
    },
    {
      id: 5,
      title: {
        ar: 'مكياج',
        tr: 'Makyaj'
      },
      description: {
        ar: 'جلسة مكياج فاخرة في منزلك، أرقى مستحضرات التجميل العالمية بخصوصية تامة',
        tr: 'Evinizde lüks makyaj seansı, dünya markaları kozmetiklerle tam mahremiyet'
      },
      image: '/videos/services/service-makeup.mp4',
      gradient: 'from-fuchsia-400 to-purple-400',
      icon: '💄'
    },
    {
      id: 6,
      title: {
        ar: 'العناية بالشعر',
        tr: 'Saç Bakımı'
      },
      description: {
        ar: 'علاجات طبيعية متقدمة لشعرك في راحة منزلك، استعادة الحيوية والنعومة',
        tr: 'Evinizde doğal saç tedavileri, canlılık ve yumuşaklığı geri kazandırıyoruz'
      },
      image: '/videos/services/service-haircare.mp4',
      gradient: 'from-emerald-400 to-teal-400',
      icon: '🌿'
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {language === 'ar' ? 'خدماتنا المنزلية' : 'Evde Hizmet Paketlerimiz'}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-poppins">
            {language === 'ar'
              ? 'نأتي إليك أينما كنت لنقدم أفضل خدمات التجميل والعناية في راحة منزلك، خصوصية تامة ومعايير عالية من الجودة'
              : 'Size geliyoruz! Evinizin konforunda en kaliteli güzellik ve bakım hizmetlerini sunuyoruz. Tam mahremiyet ve yüksek kalite standartları'
            }
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Video Container - Vertical (Instagram/Pinterest style) */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-t-3xl">
                <VideoComponent service={service} index={index} />

                {/* Subtle overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating Title on Video */}
                <div className="absolute top-6 left-6 right-6">
                  <h3 className="text-2xl font-playfair font-bold text-white drop-shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {service.title[language]}
                  </h3>
                </div>

                {/* Modern Glass Badge */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 text-white text-sm font-medium shadow-lg">
                  {language === 'ar' ? 'خدمة منزلية' : 'Ev Hizmeti'}
                </div>

                {/* Modern Decorative Elements */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>

              {/* Content Section - Modern Glass */}
              <div className="p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm">
                <p className="text-gray-700 leading-relaxed mb-6 font-poppins text-sm">
                  {service.description[language]}
                </p>

                {/* Action Button */}
                <a
                  href="#appointment"
                  className={`block w-full py-4 px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl text-center shadow-lg hover:shadow-pink-200/50 relative overflow-hidden group-hover:animate-pulse`}
                >
                  <span className="relative z-10">{language === 'ar' ? 'احجز الآن' : 'Rezervasyon Yap'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>

              {/* Ambient Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-xl border border-white/20">
            <a
              href="#appointment"
              className="px-12 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {language === 'ar' ? 'احجز موعدك الآن' : 'Hemen Randevu Al'}
            </a>
            <div className="px-6 py-4 text-gray-600 font-medium">
              {language === 'ar' ? 'أو' : 'veya'}
            </div>
            <a
              href="tel:+905366785849"
              className="px-8 py-4 text-gray-700 font-semibold hover:text-pink-600 transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              {language === 'ar' ? 'اتصل بنا' : 'Ara'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;