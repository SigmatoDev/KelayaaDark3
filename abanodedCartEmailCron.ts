import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const CRON_ENDPOINT = process.env.ABANDONED_CART_API_URL!; // Ensure this is set in your environment

const reminderIntervals = [
  { minutes: 5, count: 0 },
  { minutes: 10, count: 1 },
  { minutes: 15, count: 2 },
  { minutes: 20, count: 3 },
  { minutes: 25, count: 4 },
  { minutes: 30, count: 5 },
];

const runAbandonedCartReminder = async (interval: {
  minutes: number;
  count: number;
}) => {
  if (!CRON_ENDPOINT) {
    console.warn("CRON_ENDPOINT", CRON_ENDPOINT);
    console.error("❌ ABANDONED_CART_API_URL is not defined in .env");
    return;
  }

  try {
    const now = new Date();
    console.log(
      `📦 Triggering abandoned cart reminder (interval ${interval.count}) at ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
    );

    // Trigger the API for abandoned cart reminder
    const res = await axios.get(CRON_ENDPOINT);
    console.log(
      `✅ Abandoned cart emails sent: ${JSON.stringify(res.data, null, 2)}`
    );
  } catch (error: any) {
    // Cast the error to 'any' or 'Error'
    console.error(
      "❌ Error while sending abandoned cart email:",
      error.message || error // Now error.message will be valid
    );
  }
};

// ⏰ Run the cron job every 5 minutes
cron.schedule(
  "*/5 * * * *",
  () => {
    reminderIntervals.forEach(async (interval) => {
      // Adjust the current time based on the interval and trigger email sending logic
      await runAbandonedCartReminder(interval);
    });
  },
  { timezone: "Asia/Kolkata" }
);

console.log("⏳ Abandoned cart cron jobs scheduled to run every 5 minutes ✅");
