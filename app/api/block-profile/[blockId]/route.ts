import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { BlockProfile } from '@/lib/mongoose/models/block-profile.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    const profile = await BlockProfile.findOne({ block: params.blockId });

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
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const existingProfile = await BlockProfile.findOne({ block: params.blockId });

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    const profile = await BlockProfile.create({
      ...body,
      block: params.blockId,
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
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const profile = await BlockProfile.findOneAndUpdate(
      { block: params.blockId },
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
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    const profile = await BlockProfile.findOneAndDelete({ block: params.blockId });

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
