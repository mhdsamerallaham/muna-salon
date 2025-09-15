# 💇‍♀️ Muna | Özel Kadın Kuaförlüğü

Modern, premium ve kullanıcı dostu web sitesi. Tanıtım ve randevu alma işlevleri içeren profesyonel kuaför salonu web uygulaması.

## ✨ Özellikler

### 🎯 Temel İşlevler
- **Landing Page**: Modern tasarım ile tanıtım
- **Randevu Sistemi**: Gün + saat seçimi, otomatik bloklama
- **WhatsApp Entegrasyonu**: Tek tıkla iletişim
- **Çok Dil Desteği**: Varsayılan Arapça, opsiyonel Türkçe
- **Admin Panel**: Kuaför için müsaitlik ve randevu yönetimi

### 🛠️ Hizmetler
- ✂️ Saç Kesimi
- 🎨 Saç Boyama
- 💫 Saç Şekillendirme
- 👑 Gelin Saçı
- 💄 Makyaj
- 🌿 Saç Bakımı

## 🎨 Tasarım Konsepti

### Renk Paleti
- **Soft & Kadınsı**: Pembe (#F8BBD9), Krem (#F5F5DC), Altın (#D4AF37)
- **Premium & Lüks**: Siyah (#1C1C1C), Beyaz (#FFFFFF), Gri (#F8F9FA)

### Tipografi
- **Başlıklar**: Playfair Display (zarif serif)
- **İçerik**: Poppins (modern sans-serif)

## ⚙️ Teknoloji Stack'i

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Animasyon**: Framer Motion (gelecekte eklenebilir)
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (Admin için)
- **Email**: Nodemailer

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16+)
- MongoDB (lokal veya Atlas)
- npm veya yarn

### Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

### Backend Kurulumu
```bash
cd backend
npm install

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle

# Development server başlat
npm run dev
```

### Ortam Değişkenleri (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/muna-salon
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-super-secret-jwt-key
```

## 📱 API Endpoints

### Randevu İşlemleri
- `POST /api/appointments` - Yeni randevu oluştur
- `GET /api/appointments` - Randevuları listele
- `GET /api/appointments/available-slots?date=YYYY-MM-DD` - Müsait saatleri getir
- `PUT /api/appointments/:id/status` - Randevu durumu güncelle

### Örnek API Kullanımı
```javascript
// Yeni randevu oluşturma
const response = await fetch('http://localhost:5000/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Ayşe Yılmaz',
    phone: '+90 536 678 5849',
    service: 'haircut',
    date: '2024-01-15',
    time: '14:30',
    language: 'tr'
  }),
});
```

## 🗓️ Randevu Sistemi Mantığı

### Zaman Slot'ları
```
09:00 - 10:30 - 12:00 - 13:30 - 15:00 - 16:30 - 18:00
```

### Otomatik Bloklama Kuralları
- Randevu alındığında **1.5 saat öncesi** ve **3 saat sonrası** otomatik bloklanır
- Kuaför admin panelinden gün kapatabilir (tatil/müsait değil)
- Çakışan randevular otomatik olarak reddedilir

### Durum Yönetimi
- `pending`: Beklemede (yeni randevu)
- `confirmed`: Onaylandı
- `cancelled`: İptal edildi

## 💬 WhatsApp Entegrasyonu

### Ayarlar
- **Numara**: +90 536 678 5849
- **Hazır Mesaj**:
  - 🇸🇾 "مرحباً منى، أريد حجز موعد."
  - 🇹🇷 "Merhaba Muna, randevu almak istiyorum."

## 🌍 Çok Dil Desteği

### Desteklenen Diller
- **Arapça**: Varsayılan dil
- **Türkçe**: İkinci seçenek

### Dil Değişimi
- Header'da toggle buton: 🇸🇾 Ar / 🇹🇷 Tr
- Tüm içerik dinamik olarak değişir

## 📁 Proje Yapısı

```
muna-salon/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── assets/images/
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🔮 Gelecek Özellikler

### Phase 2
- [ ] Admin Dashboard (randevu yönetimi)
- [ ] Email bildirimler (müşteri + kuaför)
- [ ] SMS bildirimleri
- [ ] Gelişmiş randevu yönetimi

### Phase 3
- [ ] Müşteri profilleri
- [ ] Hizmet fiyat listesi
- [ ] Online ödeme (iyzico/PayTR)
- [ ] Galeri sistemi (çalışma örnekleri)

### Phase 4
- [ ] Mobil uygulama (React Native)
- [ ] WhatsApp Business API entegrasyonu
- [ ] Sosyal medya entegrasyonu
- [ ] SEO optimizasyonu

## 📈 Performans ve Güvenlik

### Frontend Optimizasyonu
- Vite ile hızlı geliştirme
- TailwindCSS ile CSS optimizasyonu
- Lazy loading (gelecekte)
- Image optimization (gelecekte)

### Backend Güvenliği
- CORS konfigürasyonu
- Input validation
- JWT authentication
- Rate limiting (gelecekte)
- MongoDB injection koruması

## 🐛 Bilinen Sorunlar

- [ ] Placeholder görseller gerçek fotoğraflarla değiştirilmeli
- [ ] Email bildirimleri henüz aktif değil
- [ ] Admin paneli geliştirilmeli
- [ ] Responsive tasarım iyileştirmeleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

**Proje Sahibi**: Muna
**Telefon**: +90 536 678 5849
**WhatsApp**: [Direkt Mesaj](https://wa.me/905366785849)

---

⭐ **Bu projeyi beğendiyseniz yıldızlamayı unutmayın!** ⭐
