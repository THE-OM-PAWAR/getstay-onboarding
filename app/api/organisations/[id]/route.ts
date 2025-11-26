import { NextRequest, NextResponse } from 'next/server';
import { Organisation } from '@/lib/mongoose/models/organisation.model';
import connectDB from '@/lib/mongoose/connection';
import { Hostel } from '@/lib/mongoose/models/hostel.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const organisation = await Organisation.findById(params.id);

    if (!organisation) {
      return NextResponse.json(
        { success: false, error: 'Organisation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: organisation });
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

    const organisation = await Organisation.findByIdAndUpdate(
      params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!organisation) {
      return NextResponse.json(
        { success: false, error: 'Organisation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: organisation });
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

    // Check if organisation exists
    const organisation = await Organisation.findById(params.id);
    if (!organisation) {
      return NextResponse.json(
        { success: false, error: 'Organisation not found' },
        { status: 404 }
      );
    }

    // Check if there are any hostels associated with this organisation
    const hostelCount = await Hostel.countDocuments({ organisation: params.id });
    if (hostelCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete organisation. There are ${hostelCount} hostel(s) associated with this organisation. Please delete all hostels first.`,
          hostelCount 
        },
        { status: 400 }
      );
    }

    // If no hostels exist, proceed with deletion
    await Organisation.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Organisation deleted successfully',
      data: {} 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
