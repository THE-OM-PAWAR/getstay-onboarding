import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const roomType = await RoomType.findById(params.id).populate('components');

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: 'Room type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roomType });
  } catch (error: any) {
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

    const roomType = await RoomType.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate('components');

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: 'Room type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roomType });
  } catch (error: any) {
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

    const roomType = await RoomType.findByIdAndDelete(params.id);

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: 'Room type not found' },
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
