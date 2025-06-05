import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import AbandonedCart from "@/lib/models/AbondenCart";
import { sendAbandonedCartEmail } from "@/utility/sendAbanodedEmails";

export async function GET() {
  await dbConnect();

  const now = new Date();

  const reminderIntervals = [
    { minutes: 1, count: 0 },
    { minutes: 5, count: 0 },
    { minutes: 30, count: 0 },
    { hours: 6, count: 1 },
    { hours: 24, count: 2 },
    { days: 2, count: 3 },
  ];

  const remindersSent: string[] = [];

  for (const interval of reminderIntervals) {
    const threshold = new Date(now);
    if (interval.minutes)
      threshold.setMinutes(threshold.getMinutes() - interval.minutes);
    if (interval.hours)
      threshold.setHours(threshold.getHours() - interval.hours);
    if (interval.days) threshold.setDate(threshold.getDate() - interval.days);

    const carts = await AbandonedCart.find({
      isRecovered: false,
      reminderCount: interval.count,
      updatedAt: { $lte: threshold },
    });

    for (const cart of carts) {
      await sendAbandonedCartEmail(cart);
      cart.lastReminderSentAt = now;
      cart.reminderCount += 1;
      await cart.save();
      remindersSent.push(cart.userId.toString());
    }
  }

  return NextResponse.json({ sent: remindersSent.length });
}
