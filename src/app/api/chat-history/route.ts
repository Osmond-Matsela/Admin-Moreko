import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/DatabaseOperations';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parentNum = searchParams.get('parentNum');
  if (!parentNum) {
    return NextResponse.json({ error: 'parentNum required' }, { status: 400 });
  }
  try {
    const q = query(collection(db, 'sms-chat'), where('number', '==', parentNum));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => doc.data());
    // Sort by timestamp ascending
    messages.sort((a, b) => a.timestamp - b.timestamp);
    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
