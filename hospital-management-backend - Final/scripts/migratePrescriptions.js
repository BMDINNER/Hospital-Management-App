const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../model/Users');
const Prescription = require('../model/Prescription');

require('dotenv').config();

/**
 * Prescription Data Migration Script
 * 
 * Migrates embedded prescription data from User appointment documents
 * to standalone Prescription collection documents.
 * 
 * Used during schema evolution when moving from embedded prescriptions
 * to a separate collection architecture.
 * 
 * @function migratePrescriptions
 * @async
 * @throws {Error} If migration process fails
 * 
 * @example
 * // Run migration (one-time operation):
 * // node scripts/migratePrescriptions.js
 * 
 * @note This is a one-time migration script
 * @warning Back up database before running
 * @deprecated After migration, remove embedded prescription data from User model
 * 
 * @process
 * 1. Find users with appointment.prescriptionId references
 * 2. Check if prescription already exists in Prescription collection
 * 3. Extract embedded prescription data from appointments
 * 4. Create standalone Prescription documents
 * 5. Log migration statistics
 */
const migratePrescriptions = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find users with prescription references in their appointments
    const users = await User.find({ 
      'appointments.prescriptionId': { $exists: true, $ne: null } 
    });
    
    console.log(`Found ${users.length} users with prescription references`);

    let migratedCount = 0;
    let errorCount = 0;

    // Process each user's appointments
    for (const user of users) {
      for (const appointment of user.appointments) {
        if (appointment.prescriptionId) {
          try {
            // Check if prescription already migrated
            const existingPrescription = await Prescription.findOne({ 
              appointmentId: appointment._id 
            });
            
            if (existingPrescription) {
              console.log(`Prescription already exists for appointment ${appointment._id}`);
              continue;
            }

            // Extract embedded prescription data
            if (appointment.prescription) {
              const prescriptionData = {
                appointmentId: appointment._id,
                userId: user._id,
                hospitalName: appointment.hospitalName,
                department: appointment.department,
                doctorName: appointment.doctorName,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                diagnosis: appointment.prescription.diagnosis || 'Not specified',
                medications: appointment.prescription.medications || [],
                instructions: appointment.prescription.instructions || 'Follow doctor instructions',
                followUpDate: appointment.prescription.followUpDate,
                prescribedAt: appointment.prescription.prescribedAt || new Date(),
                status: 'active'
              };

              await Prescription.create(prescriptionData);
              migratedCount++;
              console.log(`Migrated prescription for appointment ${appointment._id}`);
            }
          } catch (err) {
            console.error(`Error migrating prescription for appointment ${appointment._id}:`, err.message);
            errorCount++;
          }
        }
      }
    }

    console.log(`\nMigration completed:`);
    console.log(`Successfully migrated: ${migratedCount} prescriptions`);
    console.log(`Errors: ${errorCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
};

migratePrescriptions();