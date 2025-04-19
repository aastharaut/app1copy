/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure your email provider (example uses Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.processEmailQueue = functions.firestore
  .document("emailQueue/{emailId}")
    .onCreate(async (snapshot, context) => {
      const emailData = snapshot.data();
      if (emailData.type !== "APPOINTMENT_CONFIRMATION" || emailData.status !== "pending") {
      return null;}
    
      try {
          // Build the email content
      const details = emailData.appointmentDetails;
      const mailOptions = {
        from: '"HormonIQ" <hormoniq-8420b.firebaseapp.com>',
        to: emailData.to,
        subject: 'Your Appointment Confirmation',
        html: `
          <h2>Appointment Confirmation</h2>
          <p>Hello ${details.userName},</p>
          <p>Your appointment with Dr. ${details.doctorName} has been confirmed.</p>
          <p><strong>Date:</strong> ${details.date}</p>
          <p><strong>Time:</strong> ${details.timeSlot}</p>
          <p><strong>Concerns:</strong> ${details.concerns}</p>
          <p>Please arrive 15 minutes before your appointment time.</p>
          <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
          <p>Thank you for choosing our services.</p>
        `
      };
      
      // Send the email
      await transporter.sendMail(mailOptions);
      
      // Update the email status to sent
      await snapshot.ref.update({ 
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp() 
      });
      
      return null;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Update the status to failed
      await snapshot.ref.update({ 
        status: 'failed',
        error: error.message,
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    }
  });