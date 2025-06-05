// cron/abandonedCartReminder.ts
import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const CRON_ENDPOINT = process.env.ABANDONED_CART_API_URL!; // https://yourdomain.com/api/cron/abandoned-cart

const runAbandonedCartReminder = async () => {
  if (!CRON_ENDPOINT) {
    console.warn(CRON_ENDPOINT);

    console.error("❌ ABANDONED_CART_API_URL is not defined in .env");
    return;
  }

  try {
    console.log(
      `📦 Triggering abandoned cart reminder at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
    );
    const res = await axios.get(CRON_ENDPOINT);
    console.log(`✅ Abandoned cart emails sent: ${res.data.sent}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Email sending error:", error.message);
    } else {
      console.error("❌ Unknown error:", error);
    }
  }
};

// ⏰ Schedule 4 reminders matching your intervals (30min, 6hr, 24hr, 48hr)
// const scheduleTimes = [
//   { minute: "*", hour: "*" },
//   { minute: 0, hour: "*" }, // Every hour (for 30min match)
//   { minute: 15, hour: "*/6" }, // Every 6 hours at :15
//   { minute: 30, hour: "*/24" }, // Every 24 hrs at :30
//   { minute: 45, hour: "*/48" }, // Every 48 hrs at :45
// ];

const scheduleTimes = [
  { minute: "*", hour: "*" }, // every minute
];

scheduleTimes.forEach(({ minute, hour }) => {
  const cronTime = `${minute} ${hour} * * *`;
  cron.schedule(
    cronTime,
    () => {
      runAbandonedCartReminder();
    },
    { timezone: "Asia/Kolkata" }
  );
});

console.log("⏳ Abandoned cart cron jobs scheduled ✅");
