import nodemailer from 'nodemailer'

// Lazy email transporter creation
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const emailTransporter = getTransporter()
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || `"QuixPro" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function generatePasswordResetEmail(resetUrl: string, userName: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - QuixPro</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #4338ca;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .security-note {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .expiry-note {
          color: #ef4444;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎓 QuixPro</div>
          <h1 class="title">Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password for your QuixPro account. Click the button below to securely reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </div>
          
          <div class="security-note">
            <strong>🔒 Security Notice:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This link will expire in <span class="expiry-note">1 hour</span></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4f46e5; font-size: 12px;">${resetUrl}</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message from QuixPro Educational Platform.</p>
          <p>© 2024 QuixPro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generatePasswordResetConfirmationEmail(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Confirmation - QuixPro</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .success-icon {
          font-size: 48px;
          color: #10b981;
          margin-bottom: 20px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎓 QuixPro</div>
          <div class="success-icon">✅</div>
          <h1 class="title">Password Reset Successful</h1>
        </div>
        
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Your password has been successfully reset for your QuixPro account.</p>
          
          <p><strong>What's next?</strong></p>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Log in to your account with your new password</li>
            <li>Update your profile information if needed</li>
            <li>Continue your learning journey</li>
          </ul>
          
          <p>If you didn't make this change, please contact our support team immediately.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message from QuixPro Educational Platform.</p>
          <p>© 2024 QuixPro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
