import { Resend } from "resend";
import nodemailer from "nodemailer";

// Lazy initializer instead of top-level throw when key is missing
let _resend: Resend | null | undefined;
function getResendClient(): Resend | null {
  if (_resend !== undefined) return _resend; // cached (can be null)
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(
      "[email] RESEND_API_KEY not set. Resend emails will be skipped (will try SMTP fallback if configured)."
    );
    _resend = null;
    return _resend;
  }
  try {
    _resend = new Resend(key);
    return _resend;
  } catch (e) {
    console.error("[email] Failed to initialize Resend client:", e);
    _resend = null;
    return _resend;
  }
}

// SMTP configuration for Namecheap or other email providers
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.privateemail.com", // Namecheap's SMTP server
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS, // Your email password
  },
});

function smtpConfigured() {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

// Email service type (auto fallback to smtp if resend selected but key missing)
const RAW_EMAIL_SERVICE = process.env.EMAIL_SERVICE || "resend"; // desired
const EMAIL_SERVICE =
  RAW_EMAIL_SERVICE === "resend" &&
  !process.env.RESEND_API_KEY &&
  smtpConfigured()
    ? "smtp"
    : RAW_EMAIL_SERVICE;

export interface BookingNotificationData {
  bookingId?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  serviceCategory?: string; // added
  date: string;
  time: string;
  sessionType?: string;
  sessionDuration?: number;
  message: string;
  emergencyContact?: string;
  medicalHistory?: string;
  currentMedications?: string;
  previousPhysiotherapy?: string;
  confirmationNumber: string;
}

export async function sendAdminBookingNotification(
  bookingData: BookingNotificationData
) {
  try {
    const adminEmail =
      process.env.ADMIN_EMAIL || "easeway.physiotherapy@easewaymedicare.co.uk";

    const isTBD = bookingData.time === "TBD";

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FF3133; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Booking Notification</h1>
          <p style="margin: 5px 0;">Easeway Medicare Physiotherapy Clinic</p>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #0E2127; margin-bottom: 20px;">Booking Details</h2>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="color: #FF3133; margin-top: 0;">Patient Information</h3>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
          </div>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="color: #FF3133; margin-top: 0;">Appointment Details</h3>
            <p><strong>Service Category:</strong> ${
              bookingData.serviceCategory || "N/A"
            }</p>
            <p><strong>Service:</strong> ${bookingData.service}</p>
            ${
              isTBD
                ? `<p><strong>Date / Time:</strong> To Be Confirmed (Home Visit)</p>`
                : `<p><strong>Date:</strong> ${bookingData.date}</p><p><strong>Time:</strong> ${bookingData.time}</p>`
            }
            ${
              bookingData.sessionType
                ? `<p><strong>Session Type:</strong> ${bookingData.sessionType}</p>`
                : ""
            }
            ${
              bookingData.sessionDuration
                ? `<p><strong>Duration:</strong> ${bookingData.sessionDuration} minutes</p>`
                : ""
            }
            <p><strong>Confirmation Number:</strong> ${
              bookingData.confirmationNumber
            }</p>
          </div>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="color: #FF3133; margin-top: 0;">Message</h3>
            <p>${bookingData.message}</p>
          </div>
          
          ${
            bookingData.medicalHistory ||
            bookingData.currentMedications ||
            bookingData.previousPhysiotherapy
              ? `
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="color: #FF3133; margin-top: 0;">Medical Information</h3>
            ${
              bookingData.medicalHistory
                ? `<p><strong>Medical History:</strong> ${bookingData.medicalHistory}</p>`
                : ""
            }
            ${
              bookingData.currentMedications
                ? `<p><strong>Current Medications:</strong> ${bookingData.currentMedications}</p>`
                : ""
            }
            ${
              bookingData.previousPhysiotherapy
                ? `<p><strong>Previous Physiotherapy:</strong> ${bookingData.previousPhysiotherapy}</p>`
                : ""
            }
          </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="${
              process.env.NEXTAUTH_URL?.startsWith("http")
                ? process.env.NEXTAUTH_URL
                : `https://${
                    process.env.NEXTAUTH_URL || "easewaymedicare.co.uk"
                  }`
            }/admin/dashboard" 
               style="background-color: #FF3133; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>This is an automated notification from your booking system.</p>
          <p>Please contact the patient within 24 hours to confirm the appointment.</p>
        </div>
      </div>
    `;

    // Send email based on configured service
    if (EMAIL_SERVICE === "smtp") {
      // Use SMTP (Namecheap email)
      const mailOptions = {
        from: `"Easeway Medicare" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Booking: ${bookingData.name} - ${
          isTBD
            ? "Home Visit (TBC)"
            : bookingData.date + " at " + bookingData.time
        }`,
        html: emailContent,
      };

      const result = await smtpTransporter.sendMail(mailOptions);
      console.log("Admin notification email sent via SMTP:", result.messageId);
      return { success: true, messageId: result.messageId };
    } else {
      // Use Resend (default when key present). If no key, soft skip or fallback.
      const resendClient = getResendClient();
      if (!resendClient) {
        if (smtpConfigured()) {
          // fallback silently to SMTP
          const mailOptions = {
            from: `"Easeway Medicare" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `New Booking: ${bookingData.name} - ${
              isTBD
                ? "Home Visit (TBC)"
                : bookingData.date + " at " + bookingData.time
            }`,
            html: emailContent,
          };
          const result = await smtpTransporter.sendMail(mailOptions);
          console.log(
            "Admin notification email sent via SMTP fallback (missing Resend key):",
            result.messageId
          );
          return {
            success: true,
            messageId: result.messageId,
            fallback: "smtp",
          };
        }
        console.warn(
          "[email] Skipping admin notification email: no RESEND_API_KEY and SMTP not fully configured."
        );
        return {
          success: false,
          skipped: true,
        };
      }
      const data = await resendClient.emails.send({
        from: "Easeway Medicare <easeway.physiotherapy@easewaymedicare.co.uk>", // Using verified domain
        to: [adminEmail],
        subject: `New Booking: ${bookingData.name} - ${
          isTBD
            ? "Home Visit (TBC)"
            : bookingData.date + " at " + bookingData.time
        }`,
        html: emailContent,
      });

      console.log("Admin notification email sent via Resend:", data);
      return { success: true, data: data };
    }
    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return { success: false, error };
  }
}

export async function sendPatientConfirmationEmail(
  bookingData: BookingNotificationData
) {
  try {
    const isTBD = bookingData.time === "TBD";

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FF3133; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Booking Confirmation</h1>
          <p style="margin: 5px 0;">Easeway Medicare Physiotherapy Clinic</p>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;"><strong>📧 Action Required:</strong> This patient confirmation email was sent to you instead of the customer. 
            Please forward this confirmation to <strong>${
              bookingData.email
            }</strong> or contact them directly to confirm their appointment.</p>
          </div>

          <h2 style="color: #0E2127;">Dear ${bookingData.name},</h2>
          <p>Thank you for booking an appointment with Easeway Medicare Physiotherapy Clinic. 
             We have received your booking request and will contact you within 24 hours to confirm your appointment.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #FF3133; margin-top: 0;">Your Booking Details</h3>
            <p><strong>Service Category:</strong> ${
              bookingData.serviceCategory || "N/A"
            }</p>
            <p><strong>Service:</strong> ${bookingData.service}</p>
            ${
              isTBD
                ? `<p><strong>Date / Time:</strong> To Be Confirmed (We will call you to arrange your home visit)</p>`
                : `<p><strong>Date:</strong> ${bookingData.date}</p><p><strong>Time:</strong> ${bookingData.time}</p>`
            }
            <p><strong>Confirmation Number:</strong> ${
              bookingData.confirmationNumber
            }</p>
            ${
              bookingData.sessionType
                ? `<p><strong>Session Type:</strong> ${bookingData.sessionType}</p>`
                : ""
            }
            ${
              bookingData.sessionDuration
                ? `<p><strong>Duration:</strong> ${bookingData.sessionDuration} minutes</p>`
                : ""
            }
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #0E2127; margin-top: 0;">Important Notes:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Please arrive 10 minutes early for your appointment</li>
              <li>Bring any relevant medical documents or previous scan results</li>
              <li>Wear comfortable clothing suitable for physical examination</li>
              <li>If you need to cancel or reschedule, please call us at least 24 hours in advance</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>Contact Information:</strong></p>
            <p>Phone: <a href="tel:+447460091561" style="color: #FF3133;">+44 7460 091561</a></p>
            <p>Email: <a href="mailto:easeway.physiotherapy@easewaymedicare.co.uk" style="color: #FF3133;">easeway.physiotherapy@easewaymedicare.co.uk</a></p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>We look forward to helping you with your physiotherapy needs.</p>
          <p>Easeway Medicare Physiotherapy Clinic</p>
        </div>
      </div>
    `;

    // Send email based on configured service
    if (EMAIL_SERVICE === "smtp") {
      // Use SMTP (Namecheap email)
      const mailOptions = {
        from: `"Easeway Medicare" <${process.env.SMTP_USER}>`,
        to: bookingData.email,
        subject: `Booking Confirmation - ${bookingData.confirmationNumber}`,
        html: emailContent,
      };

      const result = await smtpTransporter.sendMail(mailOptions);
      console.log(
        "Patient confirmation email sent via SMTP:",
        result.messageId
      );
      return { success: true, messageId: result.messageId };
    } else {
      const resendClient = getResendClient();
      if (!resendClient) {
        if (smtpConfigured()) {
          const mailOptions = {
            from: `"Easeway Medicare" <${process.env.SMTP_USER}>`,
            to: bookingData.email,
            subject: `Booking Confirmation - ${bookingData.confirmationNumber}`,
            html: emailContent,
          };
          const result = await smtpTransporter.sendMail(mailOptions);
          console.log(
            "Patient confirmation email sent via SMTP fallback (missing Resend key):",
            result.messageId
          );
          return {
            success: true,
            messageId: result.messageId,
            fallback: "smtp",
          };
        }
        console.warn(
          "[email] Skipping patient confirmation email: no RESEND_API_KEY and SMTP not fully configured."
        );
        return {
          success: false,
        };
      }
      // Send patient confirmation emails to admin email address
      const patientEmailAddress =
        process.env.ADMIN_EMAIL ||
        "easeway.physiotherapy@easewaymedicare.co.uk";

      const data = await resendClient.emails.send({
        from: "Easeway Medicare <easeway.physiotherapy@easewaymedicare.co.uk>", // Using verified domain
        to: [patientEmailAddress],
        subject: `Patient Confirmation - ${bookingData.confirmationNumber} (for ${bookingData.email})`,
        html: emailContent,
      });

      console.log("Patient confirmation email sent via Resend:", data);
      return { success: true, data: data };
    }
  } catch (error) {
    console.error("Failed to send patient confirmation email:", error);
    return { success: false, error };
  }
}

export interface BookingStatusEmailData {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  confirmationNumber: string;
  status: "confirmed" | "cancelled";
}

export async function sendBookingStatusEmail(data: BookingStatusEmailData) {
  try {
    const isConfirmed = data.status === "confirmed";
    const isTBD = data.time === "TBD";
    const statusColor = isConfirmed ? "#28a745" : "#dc3545";
    const statusText = isConfirmed ? "Confirmed" : "Cancelled";
    const statusMessage = isConfirmed
      ? "Great news! Your appointment has been confirmed."
      : "We regret to inform you that your appointment has been cancelled.";

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FF3133; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Appointment ${statusText}</h1>
          <p style="margin: 5px 0;">Easeway Medicare Physiotherapy Clinic</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: ${statusColor}15; border: 1px solid ${statusColor}40; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; color: ${statusColor}; font-size: 16px; font-weight: bold;">${statusMessage}</p>
          </div>
          <h2 style="color: #0E2127;">Dear ${data.name},</h2>
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #FF3133; margin-top: 0;">Appointment Details</h3>
            <p><strong>Service:</strong> ${data.service}</p>
            ${isTBD ? `<p><strong>Date / Time:</strong> To Be Confirmed</p>` : `<p><strong>Date:</strong> ${data.date}</p><p><strong>Time:</strong> ${data.time}</p>`}
            <p><strong>Confirmation Number:</strong> ${data.confirmationNumber}</p>
            <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
          </div>
          ${isConfirmed ? `
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #0E2127; margin-top: 0;">Reminders:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Please arrive 10 minutes early for your appointment</li>
              <li>Bring any relevant medical documents or previous scan results</li>
              <li>Wear comfortable clothing suitable for physical examination</li>
              <li>If you need to cancel or reschedule, please call us at least 24 hours in advance</li>
            </ul>
          </div>` : `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">If you would like to rebook, please visit our website or contact us directly.</p>
          </div>`}
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>Contact Information:</strong></p>
            <p>Phone: <a href="tel:+447460091561" style="color: #FF3133;">+44 7460 091561</a></p>
            <p>Email: <a href="mailto:easeway.physiotherapy@easewaymedicare.co.uk" style="color: #FF3133;">easeway.physiotherapy@easewaymedicare.co.uk</a></p>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Easeway Medicare Physiotherapy Clinic</p>
        </div>
      </div>
    `;

    const subject = `Appointment ${statusText} - ${data.confirmationNumber}`;

    if (EMAIL_SERVICE === "smtp") {
      const result = await smtpTransporter.sendMail({
        from: `"Easeway Medicare" <${process.env.SMTP_USER}>`,
        to: data.email,
        subject,
        html: emailContent,
      });
      return { success: true, messageId: result.messageId };
    } else {
      const resendClient = getResendClient();
      if (!resendClient) {
        if (smtpConfigured()) {
          const result = await smtpTransporter.sendMail({
            from: `"Easeway Medicare" <${process.env.SMTP_USER}>`,
            to: data.email,
            subject,
            html: emailContent,
          });
          return { success: true, messageId: result.messageId, fallback: "smtp" };
        }
        return { success: false, skipped: true };
      }
      const result = await resendClient.emails.send({
        from: "Easeway Medicare <easeway.physiotherapy@easewaymedicare.co.uk>",
        to: [data.email],
        subject,
        html: emailContent,
      });
      return { success: true, data: result };
    }
  } catch (error) {
    console.error("Failed to send booking status email:", error);
    return { success: false, error };
  }
}
