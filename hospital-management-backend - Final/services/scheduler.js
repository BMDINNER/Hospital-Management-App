const { expireAppointments } = require('./appointmentService');

/**
 * Appointment Scheduler Service
 * 
 * Background job scheduler that periodically processes appointments.
 * Automatically expires confirmed appointments and generates prescriptions.
 * 
 * @class AppointmentScheduler
 * @singleton
 * 
 * @example
 * // Start the scheduler in your main application:
 * const scheduler = require('./services/AppointmentScheduler');
 * scheduler.start();
 * 
 * // Stop the scheduler (e.g., during graceful shutdown):
 * scheduler.stop();
 * 
 * @note This is a simulation service for demo purposes
 * @warning In production, consider using proper job queues (Bull, Agenda)
 * @see appointmentService.js for the actual expiration logic
 */
class AppointmentScheduler {
  constructor() {
    /** @private */
    this.interval = null;
    console.log('AppointmentScheduler initialized');
  }

  /**
   * Start the appointment processing scheduler.
   * 
   * Begins periodic execution of appointment expiration logic.
   * Runs every 10 seconds for demo/testing purposes.
   * 
   * @public
   * @method start
   * @returns {void}
   * 
   * @note Runs immediately on startup (2 second delay)
   * @todo Adjust interval based on environment (dev vs prod)
   */
  start() {
    console.log('Starting appointment scheduler...');
    
    // Run every 10 seconds for testing/demo
    // Production would use longer intervals (e.g., every hour)
    this.interval = setInterval(async () => {
      try {
        console.log('Scheduled appointment check running...');
        await expireAppointments();
      } catch (error) {
        console.error('Error in appointment scheduler:', error);
        // Don't stop scheduler on single failure
      }
    }, 10000); // 10 seconds
    
    // Run immediately on startup (after short delay)
    setTimeout(() => {
      console.log('Running initial appointment check...');
      expireAppointments().catch(err => 
        console.error('Initial appointment check failed:', err)
      );
    }, 2000);
  }

  /**
   * Stop the appointment processing scheduler.
   * 
   * Clears the interval and stops further processing.
   * Should be called during graceful shutdown.
   * 
   * @public
   * @method stop
   * @returns {void}
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Appointment scheduler stopped');
    } else {
      console.log('Appointment scheduler was not running');
    }
  }

  /**
   * Check if scheduler is currently running.
   * 
   * @public
   * @method isRunning
   * @returns {boolean} True if scheduler is active
   */
  isRunning() {
    return this.interval !== null;
  }

  /**
   * Get scheduler status information.
   * 
   * @public
   * @method getStatus
   * @returns {Object} Status object with running state
   */
  getStatus() {
    return {
      running: this.isRunning(),
      type: 'interval',
      interval: this.isRunning() ? 10000 : null
    };
  }
}

// Export singleton instance
// This ensures only one scheduler runs in the application
module.exports = new AppointmentScheduler();