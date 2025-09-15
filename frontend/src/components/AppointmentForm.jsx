import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ language = 'ar' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [closedDays, setClosedDays] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);

  // Generate time slots from 9:00 to 18:00 with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // Calculate blocked slots based on selected appointment
  const calculateBlockedSlots = (selectedTime) => {
    if (!selectedTime) return [];

    const selectedIndex = allTimeSlots.indexOf(selectedTime);
    if (selectedIndex === -1) return [];

    // Block 1.5 hours before and 3 hours after
    const blockedBefore = Math.ceil(1.5 * 2); // 1.5 hours = 3 slots (30min each)
    const blockedAfter = Math.ceil(3 * 2); // 3 hours = 6 slots (30min each)

    const blocked = [];

    // Block slots before
    for (let i = Math.max(0, selectedIndex - blockedBefore); i < selectedIndex; i++) {
      blocked.push(allTimeSlots[i]);
    }

    // Block selected slot
    blocked.push(selectedTime);

    // Block slots after
    for (let i = selectedIndex + 1; i < Math.min(allTimeSlots.length, selectedIndex + blockedAfter + 1); i++) {
      blocked.push(allTimeSlots[i]);
    }

    return blocked;
  };

  // Fetch blocked slots and closed days when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
      fetchClosedDays();
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(`http://localhost:5001/api/appointments/available-slots?date=${date}`);
      const result = await response.json();
      if (result.success) {
        setBlockedSlots(result.blockedSlots || []);
        console.log('Available slots for', date, ':', result.availableSlots);
        console.log('Blocked slots for', date, ':', result.blockedSlots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchClosedDays = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/closed-days');
      const result = await response.json();
      if (result.success) {
        setClosedDays(result.closedDays || []);
      }
    } catch (error) {
      console.error('Error fetching closed days:', error);
    }
  };

  // Check if a date is closed
  const isDateClosed = (date) => {
    return closedDays.includes(date);
  };

  // Check if a time slot is available
  const isSlotAvailable = (time) => {
    return !blockedSlots.includes(time);
  };

  const services = [
    {
      id: 'haircut',
      name: { ar: 'قص الشعر', tr: 'Saç Kesimi' }
    },
    {
      id: 'coloring',
      name: { ar: 'صبغة الشعر', tr: 'Saç Boyama' }
    },
    {
      id: 'styling',
      name: { ar: 'تسريح الشعر', tr: 'Saç Şekillendirme' }
    },
    {
      id: 'bridal',
      name: { ar: 'تسريح العرائس', tr: 'Gelin Saçı' }
    },
    {
      id: 'makeup',
      name: { ar: 'مكياج', tr: 'Makyaj' }
    },
    {
      id: 'haircare',
      name: { ar: 'العناية بالشعر', tr: 'Saç Bakımı' }
    }
  ];

  // Remove old timeSlots array - now using allTimeSlots

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setFormData({
          name: '',
          phone: '',
          service: '',
          date: '',
          time: ''
        });
        // Clear blocked slots and refresh
        setBlockedSlots([]);
        // If date was selected, refresh available slots
        if (formData.date) {
          setTimeout(() => {
            fetchAvailableSlots(formData.date);
          }, 500);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(language === 'ar'
        ? 'حدث خطأ أثناء إرسال طلب الحجز'
        : 'Randevu talebiniz gönderilirken bir hata oluştu'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <section id="appointment" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-secondary-black mb-4">
              {language === 'ar' ? 'احجز موعدك' : 'Randevu Al'}
            </h2>
            <p className="text-lg text-secondary-black/70">
              {language === 'ar'
                ? 'املأ النموذج أدناه وسنتواصل معك لتأكيد موعدك'
                : 'Aşağıdaki formu doldurun, randevunuzu onaylamak için sizinle iletişime geçeceğiz'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-secondary-gray rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-secondary-black font-medium mb-2">
                  {language === 'ar' ? 'الاسم الكامل' : 'Ad Soyad'} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                  placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Adınızı ve soyadınızı girin'}
                />
              </div>

              <div>
                <label className="block text-secondary-black font-medium mb-2">
                  {language === 'ar' ? 'رقم الهاتف' : 'Telefon Numarası'} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                  placeholder={language === 'ar' ? '+90 5XX XXX XX XX' : '+90 5XX XXX XX XX'}
                />
              </div>

              <div>
                <label className="block text-secondary-black font-medium mb-2">
                  {language === 'ar' ? 'نوع الخدمة' : 'Hizmet Türü'} *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                >
                  <option value="">
                    {language === 'ar' ? 'اختر نوع الخدمة' : 'Hizmet türünü seçin'}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-secondary-black font-medium mb-2">
                  {language === 'ar' ? 'التاريخ المفضل' : 'Tercih Edilen Tarih'} *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (isDateClosed(selectedDate)) {
                      alert(language === 'ar'
                        ? 'هذا اليوم مغلق، يرجى اختيار يوم آخر'
                        : 'Bu gün kapalı, lütfen başka bir gün seçin'
                      );
                      return;
                    }
                    handleChange(e);
                  }}
                  min={minDate}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-secondary-black font-medium mb-2">
                  {language === 'ar' ? 'الوقت المفضل' : 'Tercih Edilen Saat'} *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {allTimeSlots.map((time) => {
                    const isAvailable = isSlotAvailable(time);
                    const isSelected = formData.time === time;

                    return (
                      <label
                        key={time}
                        className={`relative flex items-center justify-center p-3 rounded-lg border transition-all ${
                          !isAvailable
                            ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-primary-gold text-white border-primary-gold cursor-pointer'
                            : 'bg-white border-gray-300 hover:border-primary-gold cursor-pointer'
                        }`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={time}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={!isAvailable}
                          required
                        />
                        <span className="font-medium text-sm">{time}</span>
                        {!isAvailable && (
                          <span className="absolute top-1 right-1 text-xs text-gray-500">
                            ✕
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {formData.date && blockedSlots.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      {language === 'ar'
                        ? 'المواعيد المحجوبة بسبب حجوزات أخرى ظاهرة باللون الرمادي'
                        : 'Diğer rezervasyonlar nedeniyle bloke edilen saatler gri renkte gösterilmektedir'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-primary-gold text-white py-4 rounded-lg font-medium text-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? (language === 'ar' ? 'جاري الإرسال...' : 'Gönderiliyor...')
                : (language === 'ar' ? 'احجز الآن' : 'Randevu Al')
              }
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;