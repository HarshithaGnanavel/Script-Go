import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Gmail Connection Failed:', error.message);
  } else {
    console.log('✅ Gmail Connection Verified! Ready to send emails.');
  }
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ EMAIL_USER or EMAIL_PASS is missing in .env.local! Emails will NOT be sent.');
}

const LAYOUT = (content: string) => `
  <div style="background-color: #020617; padding: 40px 20px; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
      <div style="background-color: #4f46e5; padding: 40px; text-align: center;">
        <div style="display: inline-block; background-color: #ffffff; color: #4f46e5; width: 48px; height: 48px; border-radius: 12px; font-weight: 900; font-size: 24px; line-height: 48px; margin-bottom: 20px;">S</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">ScriptGo</h1>
      </div>
      <div style="padding: 40px; color: #1e293b;">
        ${content}
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #64748b; font-size: 14px; text-align: center;">
          <p>© 2026 ScriptGo Studio. All rights reserved.</p>
          <p>The premium AI-powered content strategy platform.</p>
        </div>
      </div>
    </div>
  </div>
`;

export async function sendWelcomeEmail(email: string) {
  try {
    const html = LAYOUT(`
      <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Welcome to the Studio! 🚀</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #475569;">Hi there,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #475569;">We're thrilled to have you join our community of elite content creators. ScriptGo is now your secret weapon for high-impact social media content.</p>
      <div style="margin: 32px 0; background-color: #f8fafc; border-radius: 16px; padding: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px 0;">What's Next?</h3>
        <ul style="margin: 0; padding: 0; list-style: none;">
          <li style="margin-bottom: 12px; display: flex; align-items: center; color: #334155;">✨ Generate your first AI script</li>
          <li style="margin-bottom: 12px; display: flex; align-items: center; color: #334155;">📅 Organize your content in the Planner</li>
          <li style="display: flex; align-items: center; color: #334155;">🎨 Customize multi-language tones</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">Go to Dashboard</a>
      </div>
    `);

    await transporter.sendMail({
      from: `"ScriptGo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to ScriptGo! 🚀',
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Email failed:', err);
    return { error: err };
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const html = LAYOUT(`
      <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Reset Your Password</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #475569;">We received a request to reset your password for your ScriptGo account.</p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${resetLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">Reset My Password</a>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; text-align: center;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
    `);

    await transporter.sendMail({
      from: `"ScriptGo Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your ScriptGo password',
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Email failed:', err);
    return { error: err };
  }
}

export async function sendScriptEmail(email: string, scriptTitle: string, scriptContent: string) {
  try {
    const html = LAYOUT(`
      <div style="display: inline-flex; align-items: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 16px; border-radius: 99px; margin-bottom: 24px;">
        <span style="color: #15803d; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">AI Generation Ready</span>
      </div>
      <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">"${scriptTitle}"</h2>
      <p style="font-size: 16px; color: #64748b; margin-bottom: 32px;">Your high-impact script has been successfully crafted by our AI.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; white-space: pre-wrap; font-size: 15px; line-height: 1.8; color: #334155; margin-bottom: 32px;">
${scriptContent}
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">View in Editor</a>
      </div>
    `);

    await transporter.sendMail({
      from: `"ScriptGo Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Script: ${scriptTitle}`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Email failed:', err);
    return { error: err };
  }
}

export async function sendLoginEmail(email: string) {
  try {
    const html = LAYOUT(`
      <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">New Login Detected 🛡️</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #475569;">Hi there,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #475569;">Your ScriptGo account was just accessed. If this was you, you can safely ignore this email.</p>
      <div style="margin: 32px 0; background-color: #f8fafc; border-radius: 16px; padding: 24px; text-align: center;">
        <p style="font-size: 14px; color: #64748b; margin: 0;">Logged in at: ${new Date().toLocaleString()}</p>
      </div>
      <p style="font-size: 14px; color: #94a3b8;">If you didn't authorize this login, please reset your password immediately from the login page.</p>
    `);

    await transporter.sendMail({
      from: `"ScriptGo Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New Login to ScriptGo',
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Login email failed:', err);
    return { error: err };
  }
}
