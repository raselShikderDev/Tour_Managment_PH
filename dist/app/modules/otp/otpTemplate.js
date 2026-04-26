"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpEmailTemplate = otpEmailTemplate;
function otpEmailTemplate({ name, otp, expiry, appName, }) {
    const safeName = name || "User";
    const year = new Date().getFullYear();
    return `
  <html>
    <body style="margin:0; padding:0; background:#f4f4f4; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
        <tr>
          <td align="center">
            <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px;">
              
              <tr>
                <td align="center" style="font-size:20px; font-weight:bold; color:#333;">
                  Verify Your Account
                </td>
              </tr>

              <tr>
                <td style="padding:15px 0; font-size:14px; color:#555;">
                  Hi ${safeName},<br/><br/>
                  Use the One-Time Password (OTP) below:
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:10px 0;">
                  <div style="font-size:28px; font-weight:bold; letter-spacing:4px;">
                    ${otp}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:15px 0; font-size:13px; color:#777;">
                  This code expires in <strong>${expiry}</strong> minutes.
                </td>
              </tr>

              <tr>
                <td style="font-size:12px; color:#999;">
                  If you didn’t request this, ignore this email.
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px; font-size:12px; color:#bbb; text-align:center;">
                  © ${year} ${appName}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
