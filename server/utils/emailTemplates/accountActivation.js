export const accountActivationEmail = (username, activationUrl) => `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Activate your account</title>
    <style>
      @media (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 20px !important;
        }
      }
      a.button:hover {
        background: #1e40af !important;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f5f7;padding:40px 0;">
      <tr>
        <td align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:40px 40px 20px;text-align:center;">
                <img src="https://dummyimage.com/120x40/2563eb/ffffff&text=SNOOP" alt="SNOOP Logo" width="120" style="display:block;margin:0 auto 20px;" />
                <h2 style="color:#111827;font-size:22px;margin-bottom:8px;">Welcome, ${username} 👋</h2>
                <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0;">
                  Thank you for signing up! Please confirm your email address to activate your account.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:30px;">
                <a href="${activationUrl}" class="button" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 36px;border-radius:8px;transition:background 0.3s;">
                  Activate Account
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 30px;text-align:center;">
                <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0;">
                  This link will expire in 24 hours. If you didn’t create a SNOOP account, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} SNOOP. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
