import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  
  const data = await req.json();

  const apiKey = process.env.SMS_NUMBERS_API_KEY;
  console.log(data);
  const url = `https://bulk.smssouthafrica.co.za/api/App/Client/NumberManagement/Group/?groupToSearch=${data.groupID}&number=&value1=&value2=&value3=&value4=&value5=&value6=&page=1&pageSize=${data.groupSize}&sortBy=number&sortOrder=ascending`;
  console.log(url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'AEG ' + apiKey, 
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('API Error:', response.status, text);
      return NextResponse.json({ 
        error: 'API request failed', 
        status: response.status,
        details: text 
      }, { status: response.status });
    }
    
    const data = await response.json();
    // console.log('Success:', data);
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: String(err)
    }, { status: 500 });
  }
}
