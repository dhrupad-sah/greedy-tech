const db = require('../config/db');

// OTP expiration time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

class OTP {
  /**
   * Create a new OTP for a user
   * @param {string} email - User's email
   * @param {string} otp - Generated OTP code
   * @returns {Promise<Object>} OTP object
   */
  static async create(email, otp) {
    try {
      // Delete any existing OTPs for this email
      await this.deleteByEmail(email);
      
      // Calculate expiration time
      const expiresAt = new Date(Date.now() + OTP_EXPIRY);
      
      // Create new OTP
      const result = await db.query(
        'INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
        [email, otp, expiresAt]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw error;
    }
  }
  
  /**
   * Get an OTP by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} OTP object or null if not found
   */
  static async getByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
        [email]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting OTP by email:', error);
      throw error;
    }
  }
  
  /**
   * Verify an OTP
   * @param {string} email - User's email
   * @param {string} otp - OTP to verify
   * @returns {Promise<boolean>} True if OTP is valid and not expired
   */
  static async verify(email, otp) {
    try {
      const otpRecord = await this.getByEmail(email);
      
      if (!otpRecord) {
        return false;
      }
      
      // Check if OTP is expired
      if (new Date() > new Date(otpRecord.expires_at)) {
        await this.deleteByEmail(email);
        return false;
      }
      
      // Check if OTP matches
      if (otpRecord.otp !== otp) {
        return false;
      }
      
      // Delete the OTP once verified
      await this.deleteByEmail(email);
      
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }
  
  /**
   * Delete OTPs for a user
   * @param {string} email - User's email
   * @returns {Promise<void>}
   */
  static async deleteByEmail(email) {
    try {
      await db.query(
        'DELETE FROM otps WHERE email = $1',
        [email]
      );
    } catch (error) {
      console.error('Error deleting OTPs by email:', error);
      throw error;
    }
  }
  
  /**
   * Delete expired OTPs
   * @returns {Promise<number>} Number of deleted OTPs
   */
  static async deleteExpired() {
    try {
      const result = await db.query(
        'DELETE FROM otps WHERE expires_at < CURRENT_TIMESTAMP RETURNING *'
      );
      
      return result.rowCount;
    } catch (error) {
      console.error('Error deleting expired OTPs:', error);
      throw error;
    }
  }
}

module.exports = OTP; 