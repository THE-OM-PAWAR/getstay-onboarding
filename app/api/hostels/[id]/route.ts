import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { Hostel } from '@/lib/mongoose/models/hostel.model';
import { RoomType } from '@/lib/mongoose/models/room-type.model';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const hostel = await Hostel.findById(params.id)
      .populate('organisation')
      .populate('city', 'name state slug');

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

    const hostel = await Hostel.findByIdAndUpdate(
      params.id,
      body,
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

    // Check if there are any room types associated with this hostel
    const roomTypeCount = await RoomType.countDocuments({ hostelId: params.id });
    if (roomTypeCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete hostel. There are ${roomTypeCount} room type(s) associated with this hostel. Please delete all room types first.`,
          roomTypeCount 
        },
        { status: 400 }
      );
    }

    // Check if there are any room components associated with this hostel
    const componentCount = await RoomComponent.countDocuments({ hostelId: params.id });
    if (componentCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete hostel. There are ${componentCount} room component(s) associated with this hostel. Please delete all room components first.`,
          componentCount 
        },
        { status: 400 }
      );
    }

    // If no room types or components exist, proceed with deletion
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
