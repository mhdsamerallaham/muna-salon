const nodemailer = require('nodemailer');

// Email transporter configuration
// Bu ayarları Hostingar'dan aldığınız bilgilerle güncelleyin
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'info@muna-kuafor.com',
      pass: process.env.EMAIL_PASS || 'Muna2025@' // Hostingar'dan alacağınız şifre
    },
    tls: {
      rejectUnauthorized: false // Hostingar için gerekli olabilir
    }
  });
};

// Email template for appointment notifications
const createAppointmentEmailTemplate = (appointment) => {
  const isArabic = appointment.language === 'ar';

  const serviceNames = {
    ar: {
      haircut: 'قص شعر',
      styling: 'تصفيف',
      coloring: 'صبغة',
      bridal: 'عروس',
      treatment: 'علاج'
    },
    tr: {
      haircut: 'Saç Kesimi',
      styling: 'Saç Stilini',
      coloring: 'Saç Boyası',
      bridal: 'Gelin Saçı',
      treatment: 'Saç Bakımı'
    }
  };

  const sourceNames = {
    ar: {
      website: 'الموقع الإلكتروني',
      whatsapp: 'واتساب',
      phone: 'الهاتف',
      direct: 'مباشر'
    },
    tr: {
      website: 'Website',
      whatsapp: 'WhatsApp',
      phone: 'Telefon',
      direct: 'Doğrudan'
    }
  };

  if (isArabic) {
    return {
      subject: '🌸 بإذن الله - موعد جديد من منى كوافير',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e91e63; font-size: 28px; margin: 0; font-weight: bold;">🌸 منى كوافير</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">خدمة كوافير منزلي احترافية</p>
            </div>

            <!-- Blessing -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
              <h2 style="margin: 0; font-size: 20px;">🤲 بسم الله الرحمن الرحيم</h2>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">اللهم بارك في هذا العمل وأتمه على خير</p>
            </div>

            <!-- Main Content -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #e91e63; margin: 0 0 20px 0; font-size: 22px;">📅 تفاصيل الموعد الجديد</h3>

              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #e91e63;">
                  <span style="font-weight: bold; color: #333; margin-left: 10px;">👤 العميل:</span>
                  <span style="color: #666;">${appointment.name}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #9c27b0;">
                  <span style="font-weight: bold; color: #333; margin-left: 10px;">📞 الهاتف:</span>
                  <span style="color: #666;">${appointment.phone}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #673ab7;">
                  <span style="font-weight: bold; color: #333; margin-left: 10px;">✨ الخدمة:</span>
                  <span style="color: #666;">${serviceNames.ar[appointment.service] || appointment.service}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #3f51b5;">
                  <span style="font-weight: bold; color: #333; margin-left: 10px;">📅 التاريخ:</span>
                  <span style="color: #666;">${appointment.date}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <span style="font-weight: bold; color: #333; margin-left: 10px;">🕐 الوقت:</span>
                  <span style="color: #666;">${appointment.time}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #00bcd4;">
                  <span style="font-weight: bold; color: #333; margin-left: 10px;">📱 المصدر:</span>
                  <span style="color: #666;">${sourceNames.ar[appointment.source] || 'الموقع الإلكتروني'}</span>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 18px;">✅ حالة الموعد: ${appointment.status === 'confirmed' ? 'مؤكد' : appointment.status === 'pending' ? 'في الانتظار' : 'ملغي'}</h3>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #666; font-size: 14px; margin-top: 25px;">
              <p style="margin: 0;">🌸 منى كوافير - خدمة كوافير منزلي احترافية</p>
              <p style="margin: 5px 0 0 0;">تم إنشاء هذا الإشعار في: ${new Date(appointment.createdAt).toLocaleString('ar-EG')}</p>
            </div>
          </div>
        </div>
      `
    };
  } else {
    return {
      subject: '🌸 İnşallah - Muna Kuaför\'den Yeni Randevu',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e91e63; font-size: 28px; margin: 0; font-weight: bold;">🌸 Muna Kuaför</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Profesyonel Evde Kuaför Hizmeti</p>
            </div>

            <!-- Blessing -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
              <h2 style="margin: 0; font-size: 20px;">🤲 Bismillahirrahmanirrahim</h2>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Allah bu işte bereket versin ve hayırla tamamlasın</p>
            </div>

            <!-- Main Content -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #e91e63; margin: 0 0 20px 0; font-size: 22px;">📅 Yeni Randevu Detayları</h3>

              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #e91e63;">
                  <span style="font-weight: bold; color: #333; margin-right: 10px;">👤 Müşteri:</span>
                  <span style="color: #666;">${appointment.name}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #9c27b0;">
                  <span style="font-weight: bold; color: #333; margin-right: 10px;">📞 Telefon:</span>
                  <span style="color: #666;">${appointment.phone}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #673ab7;">
                  <span style="font-weight: bold; color: #333; margin-right: 10px;">✨ Hizmet:</span>
                  <span style="color: #666;">${serviceNames.tr[appointment.service] || appointment.service}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #3f51b5;">
                  <span style="font-weight: bold; color: #333; margin-right: 10px;">📅 Tarih:</span>
                  <span style="color: #666;">${appointment.date}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <span style="font-weight: bold; color: #333; margin-right: 10px;">🕐 Saat:</span>
                  <span style="color: #666;">${appointment.time}</span>
                </div>

                <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #00bcd4;">
                  <span style="font-weight: bold; color: #333; margin-right: 10px;">📱 Kaynak:</span>
                  <span style="color: #666;">${sourceNames.tr[appointment.source] || 'Website'}</span>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 18px;">✅ Randevu Durumu: ${appointment.status === 'confirmed' ? 'Onaylandı' : appointment.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}</h3>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #666; font-size: 14px; margin-top: 25px;">
              <p style="margin: 0;">🌸 Muna Kuaför - Profesyonel Evde Kuaför Hizmeti</p>
              <p style="margin: 5px 0 0 0;">Bu bildirim oluşturulma zamanı: ${new Date(appointment.createdAt).toLocaleString('tr-TR')}</p>
            </div>
          </div>
        </div>
      `
    };
  }
};

// Send appointment notification email
const sendAppointmentNotification = async (appointment) => {
  try {
    console.log('📧 Preparing to send appointment notification email...');

    const transporter = createTransporter();
    const emailTemplate = createAppointmentEmailTemplate(appointment);

    const mailOptions = {
      from: `"🌸 Muna Kuaför" <${process.env.EMAIL_USER || 'info@muna-kuafor.com'}>`,
      to: process.env.NOTIFICATION_EMAIL || 'mounaalnabhanio@gmail.com',
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    console.log('📧 Sending email notification...');
    const result = await transporter.sendMail(mailOptions);

    console.log('✅ Email notification sent successfully:', {
      messageId: result.messageId,
      to: mailOptions.to,
      subject: emailTemplate.subject
    });

    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error sending email notification:', error.message);

    // Email gönderiminde hata olsa bile appointment creation'ı durdurmayalım
    return {
      success: false,
      error: error.message,
      note: 'Appointment was created successfully but email notification failed'
    };
  }
};

// Test email configuration
const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection is ready');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
};

module.exports = {
  sendAppointmentNotification,
  testEmailConfiguration,
  createAppointmentEmailTemplate
};