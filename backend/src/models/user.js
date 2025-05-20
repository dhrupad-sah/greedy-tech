const db = require('../config/db');

class User {
  /**
   * Get a user by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }
  
  /**
   * Create a new user or get existing user
   * @param {string} email - User's email
   * @returns {Promise<Object>} User object
   */
  static async createOrGet(email) {
    try {
      // First check if user exists
      const existingUser = await this.getByEmail(email);
      
      if (existingUser) {
        return existingUser;
      }
      
      // If user doesn't exist, create a new one
      const result = await db.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING *',
        [email]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Update a user's last login time
   * @param {string} email - User's email
   * @returns {Promise<Object>} Updated user object
   */
  static async updateLastLogin(email) {
    try {
      const result = await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *',
        [email]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user last login:', error);
      throw error;
    }
  }
}

module.exports = User; 