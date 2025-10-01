import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { Block } from '@/lib/mongoose/models/block.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get('hostelId');

    if (!hostelId) {
      return NextResponse.json(
        { success: false, error: 'Hostel ID is required' },
        { status: 400 }
      );
    }

    const blocks = await Block.find({ hostel: hostelId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: blocks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, hostelId } = body;

    if (!name || !hostelId) {
      return NextResponse.json(
        { success: false, error: 'Name and hostel ID are required' },
        { status: 400 }
      );
    }

    const block = await Block.create({
      name,
      description,
      hostel: hostelId,
    });

    return NextResponse.json({ success: true, data: block }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
