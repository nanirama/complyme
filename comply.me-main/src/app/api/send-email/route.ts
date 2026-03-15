import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/site';

export async function POST(request: NextRequest) {
  try {
    // Security: Check allowed hosts (uncomment to enable in production)
    // const host = request.headers.get('host') || '';
    // const allowedHosts = ['smb.comply.me', 'comply.me', 'localhost:3000'];
    // if (!allowedHosts.includes(host)) {
    //   return NextResponse.json(
    //     { error: 'Invalid origin' },
    //     { status: 403 }
    //   );
    // }

    // Parse request body
    const body = await request.json();
    const { email, templateId, params } = body;

    // Validate required fields
    if (!email || !templateId) {
      return NextResponse.json(
        { error: 'Receiver email and templateId are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get BREVO API key from site.ts or process.env directly
    const apiKey = env.BREVO_API_KEY || '';
    
    // Debug: Log API key status (first 10 chars only for security)
    // console.log('BREVO_API_KEY check:', {
    //   fromEnv: env.BREVO_API_KEY ? `${env.BREVO_API_KEY.substring(0, 10)}...` : 'empty',
    //   fromProcessEnv: process.env.BREVO_API_KEY ? `${process.env.BREVO_API_KEY.substring(0, 10)}...` : 'empty',
    //   finalKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'empty',
    //   keyLength: apiKey ? apiKey.length : 0
    // });
    
    if (!apiKey) {
      console.error('BREVO_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Send email via BREVO API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        templateId: Number(templateId),
        to: [{ email }],
        ...(params && { params }),
      }),
    });

    const data = await response.json();

    // Check if BREVO API returned an error
    if (!response.ok) {
      console.error('BREVO API error:', data);
      return NextResponse.json(
        { error: 'Failed to send email', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
