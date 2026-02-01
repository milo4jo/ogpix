/**
 * Email service using Resend
 * 
 * To enable emails:
 * 1. Create account at resend.com
 * 2. Add RESEND_API_KEY to Vercel env vars
 * 3. Verify your domain (or use onboarding@resend.dev for testing)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "OGPix <onboarding@resend.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log("[Email] Skipped - RESEND_API_KEY not configured");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[Email] Failed to send:", error);
      return false;
    }

    console.log(`[Email] Sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Error:", error);
    return false;
  }
}

export function getWelcomeEmailHtml(userName: string): string {
  const firstName = userName?.split(" ")[0] || "there";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #111111; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Welcome to OGPix! 🎉
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                Hey ${firstName},
              </p>
              <p style="margin: 0 0 20px 0; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                Thanks for signing up! You now have access to beautiful OG images with a single API call.
              </p>
              <p style="margin: 0 0 20px 0; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                Your free plan includes <strong style="color: #ffffff;">500 images/month</strong>. Here's how to get started:
              </p>
            </td>
          </tr>

          <!-- Steps -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 24px;">
                <div style="margin-bottom: 16px;">
                  <span style="color: #ffffff; font-weight: 600;">1.</span>
                  <span style="color: #a3a3a3;"> Create an API key in your dashboard</span>
                </div>
                <div style="margin-bottom: 16px;">
                  <span style="color: #ffffff; font-weight: 600;">2.</span>
                  <span style="color: #a3a3a3;"> Use the editor to design your image</span>
                </div>
                <div>
                  <span style="color: #ffffff; font-weight: 600;">3.</span>
                  <span style="color: #a3a3a3;"> Add the URL to your og:image meta tag</span>
                </div>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <a href="https://ogpix.vercel.app/dashboard" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 8px;">
                Go to Dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #222222;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                Questions? Just reply to this email.
              </p>
              <p style="margin: 10px 0 0 0; color: #444444; font-size: 12px;">
                OGPix · Built by <a href="https://milo-site-self.vercel.app" style="color: #666666;">Milo</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "Welcome to OGPix! 🎨",
    html: getWelcomeEmailHtml(name),
  });
}
