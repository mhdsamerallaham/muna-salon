import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

const AdminPanel = ({ language = 'ar' }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [closedDays, setClosedDays] = useState([]);
  const [newClosedDate, setNewClosedDate] = useState('');
  const [newClosedReason, setNewClosedReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    language: 'tr',
    source: 'whatsapp'
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('adminAuth');
    const loginTime = localStorage.getItem('adminLoginTime');

    // Session timeout: 24 hours
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (authStatus === 'true' && loginTime) {
      const timeElapsed = Date.now() - parseInt(loginTime);
      if (timeElapsed < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminLoginTime');
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
      fetchClosedDays();
    }
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/appointments');
      const result = await response.json();
      if (result.success) {
        setAppointments(result.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchClosedDays = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/closed-days');
      const result = await response.json();
      if (result.success) {
        setClosedDays(result.fullData);
      }
    } catch (error) {
      console.error('Error fetching closed days:', error);
    }
  };

  const addClosedDay = async () => {
    if (!newClosedDate) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/closed-days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: newClosedDate,
          reason: newClosedReason || 'Closed'
        }),
      });

      const result = await response.json();
      if (result.success) {
        setNewClosedDate('');
        setNewClosedReason('');
        fetchClosedDays();
        alert(language === 'ar' ? 'تم إغلاق اليوم بنجاح' : 'Gün başarıyla kapatıldı');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding closed day:', error);
      alert(language === 'ar' ? 'حدث خطأ' : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const removeClosedDay = async (date) => {
    if (!confirm(language === 'ar' ? 'هل تريد فتح هذا اليوم؟' : 'Bu günü açmak istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/admin/closed-days/${date}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchClosedDays();
        alert(language === 'ar' ? 'تم فتح اليوم بنجاح' : 'Gün başarıyla açıldı');
      }
    } catch (error) {
      console.error('Error removing closed day:', error);
      alert(language === 'ar' ? 'حدث خطأ' : 'Bir hata oluştu');
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        fetchAppointments();
        alert(language === 'ar' ? 'تم تحديث حالة الموعد' : 'Randevu durumu güncellendi');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert(language === 'ar' ? 'حدث خطأ' : 'Bir hata oluştu');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const texts = {
      pending: { ar: 'في الانتظار', tr: 'Beklemede' },
      confirmed: { ar: 'مؤكد', tr: 'Onaylandı' },
      cancelled: { ar: 'ملغي', tr: 'İptal Edildi' }
    };
    return texts[status]?.[language] || status;
  };

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  // Fetch available slots for selected date
  const fetchAvailableSlotsForDate = async (date) => {
    try {
      const response = await fetch(`http://localhost:5001/api/appointments/available-slots?date=${date}`);
      const result = await response.json();
      if (result.success) {
        setAvailableSlots(result.availableSlots || []);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  // Handle new appointment form changes
  const handleNewAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch available slots when date changes
    if (name === 'date' && value) {
      fetchAvailableSlotsForDate(value);
    }
  };

  // Add new appointment
  const addNewAppointment = async () => {
    if (!newAppointment.name || !newAppointment.phone || !newAppointment.service ||
        !newAppointment.date || !newAppointment.time) {
      alert(language === 'ar' ? 'جميع الحقول مطلوبة' : 'Tüm alanlar gereklidir');
      return;
    }

    setIsAddingAppointment(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });

      const result = await response.json();
      if (result.success) {
        // Reset form
        setNewAppointment({
          name: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          language: 'tr',
          source: 'whatsapp'
        });
        setAvailableSlots([]);

        // Refresh appointments
        fetchAppointments();

        alert(language === 'ar' ? 'تم إضافة الموعد بنجاح' : 'Randevu başarıyla eklendi');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert(language === 'ar' ? 'حدث خطأ' : 'Bir hata oluştu');
    } finally {
      setIsAddingAppointment(false);
    }
  };

  // Services array
  const services = [
    { id: 'haircut', name: { ar: 'قص الشعر', tr: 'Saç Kesimi' } },
    { id: 'coloring', name: { ar: 'صبغة الشعر', tr: 'Saç Boyama' } },
    { id: 'styling', name: { ar: 'تسريح الشعر', tr: 'Saç Şekillendirme' } },
    { id: 'bridal', name: { ar: 'تسريح العرائس', tr: 'Gelin Saçı' } },
    { id: 'makeup', name: { ar: 'مكياج', tr: 'Makyaj' } },
    { id: 'haircare', name: { ar: 'العناية بالشعر', tr: 'Saç Bakımı' } }
  ];

  // Time slots
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

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} language={language} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
                {language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Paneli'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'إدارة المواعيد والأيام المغلقة' : 'Randevuları ve kapalı günleri yönetin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{language === 'ar' ? 'تسجيل خروج' : 'Çıkış'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              {language === 'ar' ? 'المواعيد' : 'Randevular'}
            </button>
            <button
              onClick={() => setActiveTab('addAppointment')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'addAppointment'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              {language === 'ar' ? 'إضافة موعد' : 'Randevu Ekle'}
            </button>
            <button
              onClick={() => setActiveTab('closedDays')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'closedDays'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              {language === 'ar' ? 'الأيام المغلقة' : 'Kapalı Günler'}
            </button>
          </div>

          <div className="p-6">
            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {language === 'ar' ? 'جميع المواعيد' : 'Tüm Randevular'}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'الاسم' : 'İsim'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'الهاتف' : 'Telefon'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'الخدمة' : 'Hizmet'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'التاريخ' : 'Tarih'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'الوقت' : 'Saat'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'الحالة' : 'Durum'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'المصدر' : 'Kaynak'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'ar' ? 'الإجراءات' : 'İşlemler'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appointment.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(appointment.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              appointment.source === 'website' ? 'bg-blue-100 text-blue-800' :
                              appointment.source === 'whatsapp' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.source === 'website' ? 'Website' :
                               appointment.source === 'whatsapp' ? 'WhatsApp' :
                               appointment.source === 'phone' ? 'Telefon' :
                               appointment.source === 'direct' ? 'Direkt' :
                               appointment.source || 'Website'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {appointment.status === 'pending' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded"
                                >
                                  {language === 'ar' ? 'تأكيد' : 'Onayla'}
                                </button>
                              )}
                              {appointment.status !== 'cancelled' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                                >
                                  {language === 'ar' ? 'إلغاء' : 'İptal'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Appointment Tab */}
            {activeTab === 'addAppointment' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {language === 'ar' ? 'إضافة موعد جديد (WhatsApp)' : 'Yeni Randevu Ekle (WhatsApp)'}
                </h2>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'اسم العميل' : 'Müşteri Adı'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newAppointment.name}
                        onChange={handleNewAppointmentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder={language === 'ar' ? 'اسم العميل' : 'Müşteri adı'}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الهاتف' : 'Telefon Numarası'}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAppointment.phone}
                        onChange={handleNewAppointmentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'نوع الخدمة' : 'Hizmet Türü'}
                      </label>
                      <select
                        name="service"
                        value={newAppointment.service}
                        onChange={handleNewAppointmentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر الخدمة' : 'Hizmet seçin'}
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name[language] || service.name.tr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'التاريخ' : 'Tarih'}
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={newAppointment.date}
                        onChange={handleNewAppointmentChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Source */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المصدر' : 'Kaynak'}
                      </label>
                      <select
                        name="source"
                        value={newAppointment.source}
                        onChange={handleNewAppointmentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">{language === 'ar' ? 'هاتف' : 'Telefon'}</option>
                        <option value="direct">{language === 'ar' ? 'مباشر' : 'Direkt'}</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'اللغة' : 'Dil'}
                      </label>
                      <select
                        name="language"
                        value={newAppointment.language}
                        onChange={handleNewAppointmentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Selection */}
                  {newAppointment.date && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الوقت المتاح' : 'Uygun Saatler'}
                      </label>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {availableSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setNewAppointment(prev => ({ ...prev, time }))}
                            className={`p-3 rounded-lg border transition-all ${
                              newAppointment.time === time
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'bg-white border-gray-300 hover:border-pink-500'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      {availableSlots.length === 0 && (
                        <p className="text-gray-500 text-sm mt-2">
                          {language === 'ar' ? 'لا توجد أوقات متاحة لهذا اليوم' : 'Bu gün için uygun saat yok'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      onClick={addNewAppointment}
                      disabled={isAddingAppointment || !newAppointment.name || !newAppointment.phone ||
                               !newAppointment.service || !newAppointment.date || !newAppointment.time}
                      className="w-full bg-pink-500 text-white px-4 py-3 rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAddingAppointment
                        ? (language === 'ar' ? 'جاري الإضافة...' : 'Ekleniyor...')
                        : (language === 'ar' ? 'إضافة الموعد' : 'Randevuyu Ekle')
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Closed Days Tab */}
            {activeTab === 'closedDays' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {language === 'ar' ? 'إدارة الأيام المغلقة' : 'Kapalı Günleri Yönet'}
                </h2>

                {/* Add New Closed Day */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === 'ar' ? 'إضافة يوم مغلق' : 'Yeni Kapalı Gün Ekle'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'التاريخ' : 'Tarih'}
                      </label>
                      <input
                        type="date"
                        value={newClosedDate}
                        onChange={(e) => setNewClosedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'السبب' : 'Sebep'}
                      </label>
                      <input
                        type="text"
                        value={newClosedReason}
                        onChange={(e) => setNewClosedReason(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: عطلة' : 'Örnek: Tatil'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={addClosedDay}
                        disabled={isLoading || !newClosedDate}
                        className="w-full bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading
                          ? (language === 'ar' ? 'جاري الإضافة...' : 'Ekleniyor...')
                          : (language === 'ar' ? 'إضافة' : 'Ekle')
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* Closed Days List */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">
                      {language === 'ar' ? 'الأيام المغلقة الحالية' : 'Mevcut Kapalı Günler'}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {closedDays.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        {language === 'ar' ? 'لا توجد أيام مغلقة' : 'Kapalı gün bulunmuyor'}
                      </div>
                    ) : (
                      closedDays.map((closedDay) => (
                        <div key={closedDay._id} className="px-6 py-4 flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(closedDay.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {closedDay.reason}
                            </div>
                          </div>
                          <button
                            onClick={() => removeClosedDay(closedDay.date)}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                          >
                            {language === 'ar' ? 'فتح' : 'Aç'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;