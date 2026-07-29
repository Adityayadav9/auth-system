import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Verification Code (OTP)',
    html: `<p>Your OTP code is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Verification Code',
    html: `<p>Your password reset OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
  };

  return await transporter.sendMail(mailOptions);
};