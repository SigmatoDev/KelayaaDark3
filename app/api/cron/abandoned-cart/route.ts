import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import AbandonedCart from "@/lib/models/AbondenCart";
import { sendAbandonedCartEmail } from "@/utility/sendAbanodedEmails";

export async function GET() {
  await dbConnect();

  const now = new Date();

  const reminderIntervals = [
    { minutes: 5, count: 0 },
    { minutes: 10, count: 1 },
    { minutes: 15, count: 2 },
    { minutes: 20, count: 3 },
    { minutes: 25, count: 4 },
    { minutes: 30, count: 5 },
  ];

  const remindersSent: string[] = [];

  console.log(
    "🚀 Starting abandoned cart email cron job at:",
    now.toISOString()
  );

  for (const interval of reminderIntervals) {
    const threshold = new Date(now);
    threshold.setMinutes(threshold.getMinutes() - interval.minutes);

    console.log(
      `⏰ Checking carts for reminderCount=${interval.count} before ${threshold.toISOString()}`
    );

    const dateField = interval.count === 0 ? "createdAt" : "updatedAt";

    const query: any = {
      isRecovered: false,
      reminderCount: interval.count,
      [dateField]: { $lte: threshold },
    };

    const carts = await AbandonedCart.find(query);

    console.log(
      `📦 Found ${carts.length} abandoned carts for interval`,
      interval
    );

    for (const cart of carts) {
      try {
        console.log(
          `✉️ Sending email for userId: ${cart.userId} with cart ID: ${cart._id}`
        );
        await sendAbandonedCartEmail(cart);
        console.log(`✅ Email sent for userId: ${cart.userId}`);

        cart.lastReminderSentAt = now;
        cart.reminderCount += 1;
        await cart.save();
        console.log(
          `💾 Updated reminderCount to ${cart.reminderCount} for userId: ${cart.userId}`
        );

        remindersSent.push(cart.userId.toString());
      } catch (err) {
        console.error(
          `❌ Failed to send email or update cart for userId: ${cart.userId}`,
          err
        );
      }
    }
  }

  console.log(`🎯 Total emails sent: ${remindersSent.length}`);

  return NextResponse.json({ sent: remindersSent.length, remindersSent });
}
