const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const OTP = require('../models/otp');

// Email settings - default to development mode
const EMAIL_ENABLED = process.env.ENABLE_EMAIL === 'true';
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';

// Only set up the transporter if email is enabled
let transporter = null;

// Only set up the transporter if email is enabled
if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

// Send email with OTP
const sendEmailWithOTP = async (email, otp) => {
  // Skip if transporter is not configured
  if (!transporter) {
    console.log('Email is disabled. Not sending actual email.');
    return { success: false, reason: 'Email sending is disabled' };
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Greedy Tech: Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Greedy Tech</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">Hello,</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">Your verification code for Greedy Tech is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #007AFF; padding: 15px; background-color: #f8f8f8; border-radius: 5px; display: inline-block;">${otp}</div>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">This code will expire in 5 minutes.</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">If you didn't request this code, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #999; margin-top: 30px; text-align: center;">© ${new Date().getFullYear()} Greedy Tech. All rights reserved.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, reason: error.message };
  }
};

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

    // Get or create the user
    await User.createOrGet(email);

    // Generate a new OTP
    const otp = generateOTP();
    
    // Store the OTP in the database
    await OTP.create(email, otp);

    // Log for development purposes
    console.log(`OTP for ${email}: ${otp}`);

    // Check if email sending is enabled
    if (EMAIL_ENABLED) {
      // Try to send actual email
      const emailResult = await sendEmailWithOTP(email, otp);
      
      if (emailResult.success) {
        return reply.code(200).send({ 
          success: true, 
          message: 'OTP sent successfully to your email'
        });
      } else {
        console.error('Failed to send email:', emailResult.reason);
        // Fall back to development mode if email sending fails
        return reply.code(200).send({ 
          success: true, 
          message: 'Email sending failed, using development mode instead',
          devOtp: otp
        });
      }
    } else {
      // Development mode - return OTP in response
      return reply.code(200).send({ 
        success: true, 
        message: 'OTP sent successfully (development mode)',
        devOtp: otp
      });
    }
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

    // Verify the OTP
    const isValid = await OTP.verify(email, otp);

    if (!isValid) {
      return reply.code(400).send({ error: 'Invalid or expired OTP' });
    }

    // Get or create user
    const user = await User.createOrGet(email);
    
    // Update last login time
    await User.updateLastLogin(email);

    // Format the user object for response
    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      createdAt: user.created_at.toISOString()
    };

    return reply.code(200).send({ 
      success: true, 
      message: 'OTP verified successfully',
      user: userResponse
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