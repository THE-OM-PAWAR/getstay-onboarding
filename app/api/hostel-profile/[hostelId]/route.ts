import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const profile = await HostelProfile.findOne({ hostel: params.hostelId });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const existingProfile = await HostelProfile.findOne({ hostel: params.hostelId });

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    const profile = await HostelProfile.create({
      ...body,
      hostel: params.hostelId,
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const profile = await HostelProfile.findOneAndUpdate(
      { hostel: params.hostelId },
      body,
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const profile = await HostelProfile.findOneAndDelete({ hostel: params.hostelId });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
