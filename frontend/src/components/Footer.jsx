import React from 'react';

const Footer = ({ language = 'ar' }) => {
  const whatsappMessage = language === 'ar'
    ? 'مرحباً منى، أريد حجز موعد.'
    : 'Merhaba Muna, randevu almak istiyorum.';

  const whatsappUrl = `https://wa.me/905366785849?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="bg-secondary-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-6 text-primary-gold">
              منى | Muna
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {language === 'ar'
                ? 'صالون نسائي خاص يقدم أفضل خدمات التجميل والعناية بالشعر بأعلى مستويات الجودة والاحترافية.'
                : 'En üst düzeyde kalite ve profesyonellikle güzellik ve saç bakımı hizmetleri sunan özel kadın kuaförlüğü.'
              }
            </p>
            <div className="flex space-x-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                📱
              </a>
              <a
                href="tel:+905366785849"
                className="bg-primary-gold text-white p-3 rounded-full hover:bg-yellow-600 transition-colors"
              >
                📞
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-primary-gold">
              {language === 'ar' ? 'خدماتنا' : 'Hizmetlerimiz'}
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>{language === 'ar' ? 'قص الشعر' : 'Saç Kesimi'}</li>
              <li>{language === 'ar' ? 'صبغة الشعر' : 'Saç Boyama'}</li>
              <li>{language === 'ar' ? 'تسريح الشعر' : 'Saç Şekillendirme'}</li>
              <li>{language === 'ar' ? 'تسريح العرائس' : 'Gelin Saçı'}</li>
              <li>{language === 'ar' ? 'مكياج' : 'Makyaj'}</li>
              <li>{language === 'ar' ? 'العناية بالشعر' : 'Saç Bakımı'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-primary-gold">
              {language === 'ar' ? 'معلومات التواصل' : 'İletişim Bilgileri'}
            </h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <span>📞</span>
                <span>+90 536 678 5849</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>📍</span>
                <span>
                  {language === 'ar'
                    ? 'تركيا، إسطنبول'
                    : 'İstanbul, Türkiye'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span>🕐</span>
                <div>
                  <p>{language === 'ar' ? 'ساعات العمل:' : 'Çalışma Saatleri:'}</p>
                  <p>09:00 - 19:00</p>
                  <p className="text-sm">{language === 'ar' ? 'الإثنين - السبت' : 'Pazartesi - Cumartesi'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 {language === 'ar' ? 'صالون منى. جميع الحقوق محفوظة.' : 'Muna Salon. Tüm hakları saklıdır.'}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-primary-gold transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Gizlilik Politikası'}
              </a>
              <a href="#terms" className="hover:text-primary-gold transition-colors">
                {language === 'ar' ? 'شروط الخدمة' : 'Hizmet Şartları'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;