const crypto = require('crypto');

// In-memory store for OTPs (in production, use a database)
const otpStore = new Map();

// OTP expiration time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Send OTP to email
const sendOTP = async (req, reply) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return reply.code(400).send({ error: 'Valid email is required' });
    }

    // Generate a new OTP
    const otp = generateOTP();
    
    // Store the OTP with expiration time
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY
    });

    // In a real app, you would send the OTP via email service
    // For this demo, we'll just log it
    console.log(`OTP for ${email}: ${otp}`);

    return reply.code(200).send({ 
      success: true, 
      message: 'OTP sent successfully',
      // Only for development - remove in production!
      devOtp: otp
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return reply.code(500).send({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
const verifyOTP = async (req, reply) => {
  try {
    const { email, otp } = req.body;

    if (!email || !isValidEmail(email) || !otp) {
      return reply.code(400).send({ error: 'Email and OTP are required' });
    }

    // Get stored OTP data
    const storedData = otpStore.get(email);

    if (!storedData) {
      return reply.code(400).send({ error: 'No OTP found for this email' });
    }

    if (Date.now() > storedData.expiresAt) {
      // Delete expired OTP
      otpStore.delete(email);
      return reply.code(400).send({ error: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return reply.code(400).send({ error: 'Invalid OTP' });
    }

    // OTP verified, remove it from store
    otpStore.delete(email);

    // Create a user or fetch existing user
    const userId = crypto.createHash('md5').update(email).digest('hex');
    
    // In a real app, you would store/retrieve this from a database
    const user = {
      id: userId,
      email,
      createdAt: new Date().toISOString()
    };

    return reply.code(200).send({ 
      success: true, 
      message: 'OTP verified successfully',
      user
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return reply.code(500).send({ error: 'Failed to verify OTP' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
}; 