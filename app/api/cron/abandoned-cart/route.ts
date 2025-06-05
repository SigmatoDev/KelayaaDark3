import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import AbandonedCart from "@/lib/models/AbondenCart";
import { sendAbandonedCartEmail } from "@/utility/sendAbanodedEmails";

export async function GET() {
  await dbConnect();

  const now = new Date();

  const reminderIntervals = [
    { minutes: 1, count: 0 },
    { minutes: 5, count: 1 },
    { minutes: 30, count: 2 },
    { hours: 6, count: 3 },
    { hours: 24, count: 4 },
    { days: 2, count: 5 },
  ];

  const remindersSent: string[] = [];

  console.log(
    "🚀 Starting abandoned cart email cron job at:",
    now.toISOString()
  );

  for (const interval of reminderIntervals) {
    const threshold = new Date(now);
    if (interval.minutes)
      threshold.setMinutes(threshold.getMinutes() - interval.minutes);
    if (interval.hours)
      threshold.setHours(threshold.getHours() - interval.hours);
    if (interval.days) threshold.setDate(threshold.getDate() - interval.days);

    console.log(
      `⏰ Checking carts for reminderCount=${interval.count} updated before ${threshold.toISOString()}`
    );

    const carts = await AbandonedCart.find({
      isRecovered: false,
      reminderCount: interval.count,
      updatedAt: { $lte: threshold },
    });

    console.log(
      `📦 Found ${carts.length} abandoned carts to send reminders for interval`,
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
          `💾 Updated abandoned cart reminderCount to ${cart.reminderCount} for userId: ${cart.userId}`
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

  return NextResponse.json({ sent: remindersSent.length });
}
