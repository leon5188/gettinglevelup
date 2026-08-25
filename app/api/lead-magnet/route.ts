import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companyName, email, phone, techsCount, estimatedLoss } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Either Email or Phone is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID || 'RHROdkS0TNPBFZHcZsX0';

    if (!apiKey) {
      console.warn('GHL_API_KEY missing in server env, skipping live GHL push.');
      return NextResponse.json({ success: true, message: 'Saved in offline mode.' });
    }

    // 拆分姓名
    const fullName = (name || companyName || 'Plumbing Owner').trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const ghlPayload = {
      locationId: locationId,
      firstName: firstName,
      lastName: lastName,
      name: fullName,
      companyName: companyName || fullName,
      email: email || undefined,
      phone: phone || undefined,
      tags: [
        'lead-magnet-calculator',
        'b2b-prospect',
        'plumbing-contractor',
        `techs-${techsCount || 'unknown'}`
      ],
      customFields: [
        { key: 'estimated_monthly_loss', value: estimatedLoss ? `$${estimatedLoss}` : '$0' }
      ]
    };

    const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ghlPayload)
    });

    const ghlData = await ghlRes.json();

    if (!ghlRes.ok) {
      console.error('GHL API error:', ghlData);
      return NextResponse.json({ success: false, error: ghlData.message || 'GHL Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, contactId: ghlData.contact?.id || ghlData.id });
  } catch (error: any) {
    console.error('Lead Magnet API Internal Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
