import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Save incoming SMS to sms-chat collection
  // Assume data contains sender, receiver, message, numbe
  const { sender, receiver, message, numbe } = data;
  const timestamp = Date.now();
  const { addData } = await import('@/lib/DatabaseOperations');
  await addData('sms-chat', {
    message,
    numbe,
    receiver,
    sender,
    timestamp,
  }, `${numbe}_${timestamp}`);
  return NextResponse.json({ received: data });
}
