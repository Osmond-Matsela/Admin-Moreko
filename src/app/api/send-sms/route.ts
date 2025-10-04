import { addData } from '@/lib/DatabaseOperations';
import { NextRequest, NextResponse } from 'next/server';

let apiKey = process.env.NEXT_PUBLIC_SMS_API_KEY;
let apiSecret = process.env.NEXT_PUBLIC_SMS_SECRET;
let accountApiCredentials = apiKey + ':' + apiSecret;



let base64Credentials = btoa(accountApiCredentials);

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { to, message } = data;
  const url = 'https://rest.mymobileapi.com/v3/BulkMessages';
  let options = {
    method: 'POST',
    headers: {
      'content-type': 'text/json',
      accept: 'application/json',
      Authorization: 'Basic ' + base64Credentials,
    },
    body: JSON.stringify({
      
      messages: [
        {content: message, destination: to}
      ]
    }),
  };
  
  fetch(url, options).catch(err => console.error(err));

  return NextResponse.json({message: "Message sent successfully"}, {status: 200});

}
