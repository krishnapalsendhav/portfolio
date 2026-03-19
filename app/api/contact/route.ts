import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        const SUBMISSION_GOOGLE_SCRIPT_URL = process.env.SUBMISSION_GOOGLE_SCRIPT_URL;

        if (!SUBMISSION_GOOGLE_SCRIPT_URL) {
            console.error('SUBMISSION_GOOGLE_SCRIPT_URL is not defined in environment variables');
            return NextResponse.json({
                success: false,
                error: 'Server configuration error. Please try again later.'
            }, { status: 500 });
        }

        // We send as URL search params to ensure e.parameter is populated in Google Apps Script
        // This avoids issues with JSON parsing in the GAS script provided
        const params = new URLSearchParams();
        params.append('name', name);
        params.append('email', email);
        params.append('message', message);

        const response = await fetch(SUBMISSION_GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Script API error:', errorText);
            throw new Error(`Google Script returned status ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({ success: true });
        } else {
            console.error('Google Script execution error:', data.error);
            return NextResponse.json({
                success: false,
                error: data.error || 'Failed to save message to Google Sheets'
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Contact API route error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'An unexpected error occurred'
        }, { status: 500 });
    }
}
