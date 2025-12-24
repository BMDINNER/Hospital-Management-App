const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
require('./model/index');

const scheduler = require('./services/scheduler');

/**
 * Express Server Configuration
 * 
 * Main entry point for the Hospital Management System backend API.
 * Configures middleware, routes, database connection, and background services.
 * 
 * @module server
 * @version 1.0.0
 * 
 * @requires express
 * @requires cors
 * @requires cookie-parser
 * @requires mongoose
 * @requires dotenv
 * 
 * @constant {number} PORT - Server port (3500 default)
 * @constant {Object} app - Express application instance
 * 
 * @example
 * // Start server:
 * // node server.js
 * // or
 * // npm start
 * 
 * @note Environment variables required in .env file
 * @see .env.example for required configuration
 */

// Middleware Configuration
app.use(express.json({ limit: '10mb' })); // Support large payloads (e.g., prescriptions)
app.use(cookieParser());

/**
 * CORS Configuration
 * 
 * Configured for local development with multiple frontend ports.
 * Adjust origins for production deployment.
 */
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:5174', // Vite alternate
    'http://localhost:3000', // Create React App
    'http://127.0.0.1:5500', // Live Server
    'http://127.0.0.1:5501'  // Live Server alternate
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/**
 * Server Initialization Function
 * 
 * Orchestrates database connection, service startup, and route registration.
 * Handles graceful startup and shutdown procedures.
 * 
 * @async
 * @function startServer
 * @throws {Error} If critical initialization fails
 * 
 * @process
 * 1. Connect to MongoDB
 * 2. Start background scheduler
 * 3. Register API routes
 * 4. Setup test endpoints (dev only)
 * 5. Start HTTP server
 * 6. Configure graceful shutdown
 */
const startServer = async () => {
  try {
    console.log('Starting Hospital Management System Server...');
    
    // Database Connection
    await connectDB();
    console.log('Database connection established');
    
    // Background Services
    scheduler.start();
    console.log('Background scheduler started');
    
    // Route Registration
    console.log('Setting up routes...');
    
    const registerRoutes = require('./routes/register');
    const logoutRoute = require('./routes/logout');
    const loginRoute = require('./routes/auth');
    const userRoutes = require('./routes/user');
    const hospitalRoutes = require('./routes/hospital');
    
    // Public Routes (no authentication required)
    app.use('/api/register', registerRoutes);
    app.use('/api/logout', logoutRoute);
    app.use('/api/login', loginRoute);
    
    // Protected Routes (require JWT authentication)
    app.use('/api/user', userRoutes);
    app.use('/api/hospital', hospitalRoutes);
    
    const verifyJWT = require('./middleware/verifyJWT');
    
    // Test endpoint - verify JWT middleware works
    app.post('/api/test-appointment', verifyJWT, async (req, res) => {
      try {
        res.json({
          success: true,
          message: 'Test route working',
          userId: req.userId,
          body: req.body
        });
      } catch (err) {
        console.error('Test error:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });
    
    // Development/Testing Endpoints
    // Note: These would be removed or protected in production
    
    const { expireAppointments } = require('./services/appointmentService');
    const User = require('./model/Users');
    const Prescription = require('./model/Prescription');
    
    /**
     * Manual appointment expiration endpoint (dev only)
     * 
     * @route POST /api/test/expire-appointments
     * @desc Manually trigger appointment expiration
     * @access Public (dev only)
     */
    app.post('/api/test/expire-appointments', async (req, res) => {
      try {
        const count = await expireAppointments();
        res.json({
          success: true,
          message: `Expired ${count} appointments`,
          count
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });
    
    /**
     * Appointment status monitoring (dev only)
     * 
     * @route GET /api/test/appointments-status
     * @desc Check current appointment distribution
     * @access Public (dev only)
     */
    app.get('/api/test/appointments-status', async (req, res) => {
      try {
        const users = await User.find({
          $or: [
            { 'appointments.status': 'confirmed' },
            { 'appointments.status': 'completed' }
          ]
        })
        .select('email appointments')
        .limit(10);
        
        const result = users.map(user => ({
          email: user.email,
          confirmedCount: user.appointments.filter(apt => apt.status === 'confirmed').length,
          completedCount: user.appointments.filter(apt => apt.status === 'completed').length,
          appointments: user.appointments
            .map(apt => ({
              id: apt._id,
              doctor: apt.doctorName,
              department: apt.department,
              appointmentDate: apt.appointmentDate,
              appointmentTime: apt.appointmentTime,
              createdAt: apt.createdAt,
              status: apt.status,
              prescriptionId: apt.prescriptionId || 'None'
            }))
        }));
        
        res.json({
          success: true,
          users: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });
    
    /**
     * Prescription status monitoring (dev only)
     * 
     * @route GET /api/test/prescriptions
     * @desc Check generated prescriptions
     * @access Public (dev only)
     */
    app.get('/api/test/prescriptions', async (req, res) => {
      try {
        const prescriptions = await Prescription.find({})
          .select('appointmentId diagnosis medications doctorName department')
          .limit(10);
        
        res.json({
          success: true,
          count: prescriptions.length,
          prescriptions: prescriptions
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });
    
    /**
     * Manual test appointment creation (dev only)
     * 
     * @route POST /api/test/create-appointment
     * @desc Create test appointment for current user
     * @access Private (requires JWT)
     */
    app.post('/api/test/create-appointment', verifyJWT, async (req, res) => {
      try {
        const user = await User.findById(req.userId);
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
        
        const testAppointment = {
          hospitalId: new mongoose.Types.ObjectId(),
          hospitalName: 'Test Hospital',
          departmentId: new mongoose.Types.ObjectId(),
          department: 'Test Department',
          doctorId: new mongoose.Types.ObjectId(),
          doctorName: 'Dr. Test Doctor',
          appointmentDate: new Date(),
          appointmentTime: '10:00',
          location: 'Test Location',
          status: 'confirmed',
          createdAt: new Date(),
          actualStartTime: new Date(),
          actualEndTime: new Date(Date.now() + 30 * 60000),
          slotId: new mongoose.Types.ObjectId()
        };
        
        user.appointments.push(testAppointment);
        await user.save();
        
        const savedAppointment = user.appointments[user.appointments.length - 1];
        
        res.json({
          success: true,
          message: 'Test appointment created',
          appointment: savedAppointment
        });
      } catch (error) {
        console.error('Error creating test appointment:', error);
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });
    
    // System Health & Monitoring Endpoints
    
    /**
     * Basic health check
     * 
     * @route GET /api/health
     * @desc Server and database status
     * @access Public
     */
    app.get('/api/health', (req, res) => {
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      res.json({ 
        success: true, 
        message: 'Server is running',
        database: dbStatus,
        timestamp: new Date().toISOString()
      });
    });
    
    /**
     * Detailed database status
     * 
     * @route GET /api/db-status
     * @desc MongoDB connection details
     * @access Public
     */
    app.get('/api/db-status', (req, res) => {
      const status = mongoose.connection.readyState;
      const statusText = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[status] || 'unknown';
      
      res.json({
        success: true,
        database: {
          status: statusText,
          readyState: status,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        }
      });
    });
    
    // Error Handling Middleware
    
    /**
     * 404 Not Found Handler
     * 
     * @middleware
     * @desc Catch-all for undefined routes
     */
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    });
    
    /**
     * Global Error Handler
     * 
     * @middleware
     * @desc Catch unhandled errors
     * @param {Error} err - Uncaught error
     */
    app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    });

    // Server Startup
    const PORT = process.env.PORT || 3500;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Database status: http://localhost:${PORT}/api/db-status`);
    });
    
    /**
     * Graceful Shutdown Handler
     * 
     * @listens SIGTERM
     * @desc Handle termination signals gracefully
     */
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      scheduler.stop();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();