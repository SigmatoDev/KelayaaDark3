import AdminSettings from "@/lib/models/AdminSettings";
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";

// Function to format the date to dd-mm-yyyy
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const sendAdminEmail = async (designData: any) => {
  const apiKey = process.env.BREVO_API_KEY; // Ensure this is set in your environment
  if (!apiKey) {
    console.error("❌ No Brevo API key provided");
    return;
  }

  // Initialize the Brevo API client
  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

  const settings = await AdminSettings.findOne();
  const senderEmail = settings?.brevo?.customerJewelrySenderEmail;
  const recieverEmails = settings?.brevo?.customerJewelryRecipientEmails;

  // Ensure that `senderEmail` is a string and `recieverEmails` is an array of email objects
  const sender = { email: senderEmail };

  // Prepare email data with multiple recipients
  const toList = recieverEmails.map((email: any) => ({ email }));

  // Format the appointment date to dd-mm-yyyy
  const formattedAppointmentDate = formatDate(
    new Date(designData.appointmentDate)
  );

  // Generate dynamic content for design data in table format
  const designDataContent = Object.keys(designData)
    .filter((key) => key !== "customImage") // Exclude customImage for later handling
    .map((key) => {
      return `<tr>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: left;"><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">${key === "appointmentDate" ? formattedAppointmentDate : designData[key]}</td>
        </tr>`;
    })
    .join(""); // Join rows together

  // Image section for custom image
  const customImageContent = designData.customImage
    ? ` 
        <div class="image-container" style="text-align: center; margin-top: 20px;">
          <p><strong>Custom Image:</strong></p>
          <a href="${designData.customImage}" target="_blank">
            <img src="${designData.customImage}" alt="Custom Design Image" class="custom-image" style="max-width: 100%; height: auto;">
          </a>
        </div>`
    : "";

  const emailData: SendSmtpEmail = {
    sender,
    to: toList,
    subject: `Custom Design Submission from ${designData?.contactNumber}`,
    htmlContent: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Custom Design Request</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  color: #333;
                  background-color: #f4f4f9;
                  margin: 0;
                  padding: 0;
                }
                .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                  text-align: center;
                  background-color: #e688a2;
                  color: #fff;
                  padding: 15px;
                  border-radius: 8px 8px 0 0;
                }
                .email-header h1 {
                  margin: 0;
                }
                .email-body {
                  padding: 20px;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 12px;
                  color: #777;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  padding: 12px;
                  border: 1px solid #ddd;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="email-header">
                  <h1>New Custom Design Request</h1>
                </div>
                <div class="email-body">
                  <p>A new custom design has been submitted. Below are the details:</p>
                  <table>
                    <thead>
                      <tr>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;" colspan="2"><strong>Design Data</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${designDataContent}
                    </tbody>
                  </table>
                  ${customImageContent}
                </div>
                <div class="footer">
                  <p>&copy; 2025 Kelayaa Designs. All Rights Reserved.</p>
                </div>
              </div>
            </body>
            </html>
        `,
  };

  try {
    // Send email using Brevo API
    await apiInstance.sendTransacEmail(emailData);
    console.log("✅ Admin notified via email.");
  } catch (error) {
    console.error("❌ Error sending email to admin:", error);
  }
};

export default sendAdminEmail;
