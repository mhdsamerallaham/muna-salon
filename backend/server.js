require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { sendAppointmentNotification, testEmailConfiguration } = require('./services/emailService');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// JSON file paths for free database
const DATA_DIR = path.join(__dirname, 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const CLOSED_DAYS_FILE = path.join(DATA_DIR, 'closed-days.json');

// Create data directory if not exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initialize JSON files
if (!fs.existsSync(APPOINTMENTS_FILE)) {
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(CLOSED_DAYS_FILE)) {
  fs.writeFileSync(CLOSED_DAYS_FILE, JSON.stringify([]));
}

// Helper functions for JSON database
const readAppointments = () => {
  try {
    const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading appointments:', error);
    return [];
  }
};

const writeAppointments = (appointments) => {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing appointments:', error);
    return false;
  }
};

const readClosedDays = () => {
  try {
    const data = fs.readFileSync(CLOSED_DAYS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading closed days:', error);
    return [];
  }
};

const writeClosedDays = (closedDays) => {
  try {
    fs.writeFileSync(CLOSED_DAYS_FILE, JSON.stringify(closedDays, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing closed days:', error);
    return false;
  }
};

console.log('Using JSON file database (100% free!) 🎉');
console.log('Data directory:', DATA_DIR);

// No MongoDB schemas needed - using JSON files!

// Helper function to generate all time slots
const generateAllTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

// Helper function to calculate blocked slots based on booking
const calculateBlockedSlots = (appointments) => {
  const allTimeSlots = generateAllTimeSlots();
  const blockedSlots = [];

  appointments.forEach(appointment => {
    const selectedTime = appointment.time;
    const selectedIndex = allTimeSlots.indexOf(selectedTime);

    if (selectedIndex !== -1) {
      // Block 1.5 hours before and 3 hours after
      const blockedBefore = Math.ceil(1.5 * 2); // 1.5 hours = 3 slots (30min each)
      const blockedAfter = Math.ceil(3 * 2); // 3 hours = 6 slots (30min each)

      // Block slots before
      for (let i = Math.max(0, selectedIndex - blockedBefore); i < selectedIndex; i++) {
        if (!blockedSlots.includes(allTimeSlots[i])) {
          blockedSlots.push(allTimeSlots[i]);
        }
      }

      // Block selected slot
      if (!blockedSlots.includes(selectedTime)) {
        blockedSlots.push(selectedTime);
      }

      // Block slots after
      for (let i = selectedIndex + 1; i < Math.min(allTimeSlots.length, selectedIndex + blockedAfter + 1); i++) {
        if (!blockedSlots.includes(allTimeSlots[i])) {
          blockedSlots.push(allTimeSlots[i]);
        }
      }
    }
  });

  return blockedSlots;
};

app.post('/api/appointments', async (req, res) => {
  try {
    console.log('=== Appointment creation request ===');
    console.log('Request body:', req.body);

    const { name, phone, service, date, time, language } = req.body;

    console.log('Extracted fields:', { name, phone, service, date, time, language });

    if (!name || !phone || !service || !date || !time) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: language === 'ar'
          ? 'جميع الحقول مطلوبة'
          : 'Tüm alanlar gereklidir'
      });
    }

    // JSON file storage logic
    console.log('Using JSON file storage for appointment creation');

    // Read current data
    const appointments = readAppointments();
    const closedDays = readClosedDays();

    // Check if the date is closed
    const closedDay = closedDays.find(day => day.date === date);
    if (closedDay) {
      return res.status(400).json({
        success: false,
        message: language === 'ar'
          ? 'هذا اليوم مغلق، يرجى اختيار يوم آخر'
          : 'Bu gün kapalı, lütfen başka bir gün seçin'
      });
    }

    // Get existing appointments for the date
    const existingAppointments = appointments.filter(apt =>
      apt.date === date && apt.status !== 'cancelled'
    );

    // Calculate blocked slots
    const blockedSlots = calculateBlockedSlots(existingAppointments);

    // Check if time slot is blocked
    if (blockedSlots.includes(time)) {
      return res.status(400).json({
        success: false,
        message: language === 'ar'
          ? 'هذا الوقت غير متاح بسبب موعد آخر، يرجى اختيار وقت آخر'
          : 'Bu saat başka bir randevu nedeniyle uygun değil, lütfen başka bir saat seçin'
      });
    }

    // Check for direct conflict
    const directConflict = appointments.find(apt =>
      apt.date === date && apt.time === time && apt.status !== 'cancelled'
    );

    if (directConflict) {
      return res.status(400).json({
        success: false,
        message: language === 'ar'
          ? 'هذا الموعد غير متاح'
          : 'Bu randevu uygun değil'
      });
    }

    // Create appointment
    const appointment = {
      _id: Date.now().toString(),
      name,
      phone,
      service,
      date,
      time,
      status: 'pending',
      language: language || 'ar',
      source: 'website', // Website'den gelen randevular
      createdAt: new Date().toISOString()
    };

    appointments.push(appointment);

    // Save to file
    const saved = writeAppointments(appointments);
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Error saving appointment'
      });
    }

    console.log('New appointment created:', appointment);

    // Send email notification
    try {
      const emailResult = await sendAppointmentNotification(appointment);
      console.log('📧 Email notification result:', emailResult);
    } catch (emailError) {
      console.log('⚠️ Email notification failed but appointment was created successfully:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: language === 'ar'
        ? 'تم حجز موعدك بنجاح! سنتواصل معك قريباً لتأكيد الموعد'
        : 'Randevunuz başarıyla oluşturuldu! Randevunuzu onaylamak için yakında sizinle iletişime geçeceğiz',
      appointment: {
        id: appointment._id,
        name: appointment.name,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.get('/api/appointments', (req, res) => {
  try {
    const { date } = req.query;
    let appointments = readAppointments();

    // Filter by date if provided
    if (date) {
      appointments = appointments.filter(apt => apt.date === date);
    }

    // Filter out cancelled appointments
    appointments = appointments.filter(apt => apt.status !== 'cancelled');

    // Sort by date and time
    appointments.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date) - new Date(b.date);
      }
      return a.time.localeCompare(b.time);
    });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.get('/api/appointments/available-slots', (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // JSON file storage logic
    console.log('Using JSON file storage for available slots');

    // Read current data
    const appointments = readAppointments();
    const closedDays = readClosedDays();

    // Check if date is closed
    const closedDay = closedDays.find(day => day.date === date);
    if (closedDay) {
      return res.json({
        success: true,
        availableSlots: [],
        blockedSlots: generateAllTimeSlots(),
        message: 'Day is closed'
      });
    }

    // Get existing appointments for the date
    const existingAppointments = appointments.filter(apt =>
      apt.date === date && apt.status !== 'cancelled'
    );

    const allTimeSlots = generateAllTimeSlots();
    const blockedSlots = calculateBlockedSlots(existingAppointments);
    const availableSlots = allTimeSlots.filter(time => !blockedSlots.includes(time));

    console.log('Available slots response:', { availableSlots, blockedSlots, existingAppointments: existingAppointments.length });

    res.json({
      success: true,
      availableSlots,
      blockedSlots,
      allTimeSlots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.put('/api/appointments/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Read current appointments
    const appointments = readAppointments();

    // Find appointment by ID
    const appointmentIndex = appointments.findIndex(apt => apt._id === id);

    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update status
    appointments[appointmentIndex].status = status;
    appointments[appointmentIndex].updatedAt = new Date().toISOString();

    // Save to file
    const saved = writeAppointments(appointments);
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Error updating appointment'
      });
    }

    res.json({
      success: true,
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin Routes for Closed Days Management

// Get all closed days
app.get('/api/admin/closed-days', (req, res) => {
  try {
    const closedDays = readClosedDays();
    const closedDatesList = closedDays.map(day => day.date);

    res.json({
      success: true,
      closedDays: closedDatesList,
      fullData: closedDays
    });
  } catch (error) {
    console.error('Error fetching closed days:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add a closed day
app.post('/api/admin/closed-days', (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Read current closed days
    const closedDays = readClosedDays();

    // Check if day is already closed
    const existingClosedDay = closedDays.find(day => day.date === date);
    if (existingClosedDay) {
      return res.status(400).json({
        success: false,
        message: 'Day is already marked as closed'
      });
    }

    // Create new closed day
    const closedDay = {
      _id: Date.now().toString(),
      date,
      reason: reason || 'Closed',
      createdAt: new Date().toISOString()
    };

    closedDays.push(closedDay);

    // Save to file
    const saved = writeClosedDays(closedDays);
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Error saving closed day'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Day marked as closed successfully',
      closedDay
    });
  } catch (error) {
    console.error('Error adding closed day:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Remove a closed day
app.delete('/api/admin/closed-days/:date', (req, res) => {
  try {
    const { date } = req.params;

    // Read current closed days
    const closedDays = readClosedDays();

    // Find and remove the closed day
    const initialLength = closedDays.length;
    const updatedClosedDays = closedDays.filter(day => day.date !== date);

    if (updatedClosedDays.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Closed day not found'
      });
    }

    // Save to file
    const saved = writeClosedDays(updatedClosedDays);
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Error removing closed day'
      });
    }

    res.json({
      success: true,
      message: 'Closed day removed successfully'
    });
  } catch (error) {
    console.error('Error removing closed day:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all appointments for admin
app.get('/api/admin/appointments', (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let appointments = readAppointments();

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      appointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= start && aptDate <= end;
      });
    }

    // Filter by status if provided
    if (status) {
      appointments = appointments.filter(apt => apt.status === status);
    }

    // Sort by date and time
    appointments.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date) - new Date(b.date);
      }
      return a.time.localeCompare(b.time);
    });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin manual appointment creation (for WhatsApp bookings)
app.post('/api/admin/appointments', async (req, res) => {
  try {
    console.log('=== Admin manual appointment creation ===');
    const { name, phone, service, date, time, language, source } = req.body;

    console.log('Request body:', req.body);

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar gereklidir'
      });
    }

    // Read current data
    const appointments = readAppointments();
    const closedDays = readClosedDays();

    // Check if the date is closed
    const closedDay = closedDays.find(day => day.date === date);
    if (closedDay) {
      return res.status(400).json({
        success: false,
        message: 'Bu gün kapalı, farklı bir gün seçin'
      });
    }

    // Get existing appointments for the date
    const existingAppointments = appointments.filter(apt =>
      apt.date === date && apt.status !== 'cancelled'
    );

    // Calculate blocked slots
    const blockedSlots = calculateBlockedSlots(existingAppointments);

    // Check if time slot is blocked
    if (blockedSlots.includes(time)) {
      return res.status(400).json({
        success: false,
        message: 'Bu saat başka bir randevu nedeniyle uygun değil'
      });
    }

    // Check for direct conflict
    const directConflict = appointments.find(apt =>
      apt.date === date && apt.time === time && apt.status !== 'cancelled'
    );

    if (directConflict) {
      return res.status(400).json({
        success: false,
        message: 'Bu saatte zaten bir randevu var'
      });
    }

    // Create appointment
    const appointment = {
      _id: Date.now().toString(),
      name,
      phone,
      service,
      date,
      time,
      status: 'confirmed', // Admin tarafından eklenen randevular otomatik onaylı
      language: language || 'tr',
      source: source || 'whatsapp', // WhatsApp, admin, website
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    appointments.push(appointment);

    // Save to file
    const saved = writeAppointments(appointments);
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Randevu kaydedilirken hata oluştu'
      });
    }

    console.log('Admin created appointment:', appointment);

    // Send email notification for admin-created appointments too
    try {
      const emailResult = await sendAppointmentNotification(appointment);
      console.log('📧 Admin appointment email notification result:', emailResult);
    } catch (emailError) {
      console.log('⚠️ Admin appointment email notification failed but appointment was created successfully:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Randevu başarıyla eklendi',
      appointment: {
        id: appointment._id,
        name: appointment.name,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        source: appointment.source
      }
    });

  } catch (error) {
    console.error('Error creating admin appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});