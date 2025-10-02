import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { Hostel } from '@/lib/mongoose/models/hostel.model';
import { Block } from '@/lib/mongoose/models/block.model';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const hostel = await Hostel.findById(params.id);

    if (!hostel) {
      return NextResponse.json(
        { success: false, error: 'Hostel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hostel });
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
    const { name } = body;

    const hostel = await Hostel.findByIdAndUpdate(
      params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!hostel) {
      return NextResponse.json(
        { success: false, error: 'Hostel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hostel });
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

    // Check if hostel exists
    const hostel = await Hostel.findById(params.id);
    if (!hostel) {
      return NextResponse.json(
        { success: false, error: 'Hostel not found' },
        { status: 404 }
      );
    }

    // Check if there are any blocks associated with this hostel
    const blockCount = await Block.countDocuments({ hostel: params.id });
    if (blockCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete hostel. There are ${blockCount} block(s) associated with this hostel. Please delete all blocks first.`,
          blockCount 
        },
        { status: 400 }
      );
    }

    // If no blocks exist, proceed with deletion
    await Hostel.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Hostel deleted successfully',
      data: {} 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
