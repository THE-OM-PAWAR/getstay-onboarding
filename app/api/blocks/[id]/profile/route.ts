import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { BlockProfile } from '@/lib/mongoose/models/block-profile.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const profile = await BlockProfile.findOne({ block: params.id });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error fetching block profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const existingProfile = await BlockProfile.findOne({ block: params.id });

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    const profile = await BlockProfile.create({
      ...body,
      block: params.id,
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating block profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const profile = await BlockProfile.findOneAndUpdate(
      { block: params.id },
      body,
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error updating block profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const profile = await BlockProfile.findOneAndDelete({ block: params.id });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Error deleting block profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
