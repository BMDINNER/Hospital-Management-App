const connectDB = require('../config/database');
require('../model/index');

const AppointmentSlot = require('../model/AppointmentSlot');
const Doctor = require('../model/Doctor');
const Hospital = require('../model/Hospital');

require('dotenv').config();

/**
 * Appointment Slot Verification Script
 * 
 * Diagnostic tool to check the status of appointment slots in the database.
 * Useful for troubleshooting booking issues and verifying seed data.
 * 
 * @function checkAllSlots
 * @async
 * @throws {Error} If database connection or queries fail
 * 
 * @example
 * // Run diagnostics:
 * // node scripts/checkAllSlots.js
 * 
 * @output Provides:
 * - Total slot count
 * - Available slot count
 * - Sample slot listings
 * - Specific doctor/hospital combinations
 * - Upcoming availability
 * 
 * @note Use this to verify seed script worked correctly
 * @see seedData.js for populating initial slots
 */
const checkAllSlots = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Basic slot statistics
    const totalSlots = await AppointmentSlot.countDocuments();
    console.log(`Total appointment slots in database: ${totalSlots}`);

    if (totalSlots === 0) {
      console.log('NO SLOTS FOUND IN DATABASE!');
      console.log('You need to run the seed script again:');
      console.log('node scripts/seedData.js');
      process.exit(1);
    }

    const availableSlots = await AppointmentSlot.countDocuments({
      isAvailable: true,
      isBooked: false
    });
    console.log(`Available slots: ${availableSlots}`);

    // Display sample slots for visual verification
    console.log('\nSample slots (first 10):');
    const sampleSlots = await AppointmentSlot.find()
      .populate('doctor', 'name')
      .populate('hospital', 'name')
      .sort('date startTime')
      .limit(10);

    sampleSlots.forEach(slot => {
      console.log(`- ${slot.date.toISOString().split('T')[0]} ${slot.startTime} | Dr. ${slot.doctor.name} at ${slot.hospital.name} | Available: ${slot.isAvailable}, Booked: ${slot.isBooked}`);
    });

    // Test specific doctor-hospital combination (common test case)
    console.log('\nChecking Dr. Sarah Johnson at Cedars-Sinai...');
    const sarah = await Doctor.findOne({ name: 'Dr. Sarah Johnson' });
    const cedars = await Hospital.findOne({ name: /Cedars-Sinai/i });
    
    if (sarah && cedars) {
      const specificSlots = await AppointmentSlot.find({
        doctor: sarah._id,
        hospital: cedars._id
      })
      .sort('date startTime')
      .limit(5);

      console.log(`Found ${specificSlots.length} slots for this combination:`);
      specificSlots.forEach(slot => {
        console.log(`- ${slot.date.toISOString().split('T')[0]} ${slot.startTime} | Available: ${slot.isAvailable}, Booked: ${slot.isBooked}`);
      });
    } else {
      console.log('Test doctor or hospital not found - check seed data');
    }

    // Check upcoming availability (simulates real booking queries)
    console.log('\nChecking slots by date range...');
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingSlots = await AppointmentSlot.find({
      date: { $gte: today, $lte: nextWeek },
      isAvailable: true,
      isBooked: false
    })
    .populate('doctor', 'name specialty')
    .populate('hospital', 'name')
    .sort('date startTime')
    .limit(5);

    console.log(`Upcoming available slots (next 7 days): ${upcomingSlots.length}`);
    upcomingSlots.forEach(slot => {
      console.log(`- ${slot.date.toISOString().split('T')[0]} ${slot.startTime} with Dr. ${slot.doctor.name} (${slot.doctor.specialty}) at ${slot.hospital.name}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error checking slots:', err);
    process.exit(1);
  }
};

checkAllSlots();