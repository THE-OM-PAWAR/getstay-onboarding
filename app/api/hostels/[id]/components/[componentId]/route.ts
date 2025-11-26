import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; componentId: string } }
) {
  try {
    await connectDB();

    const { id: hostelId, componentId } = params;
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const component = await RoomComponent.findOneAndUpdate(
      { _id: componentId, hostelId },
      { name, description },
      { new: true }
    );

    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: component });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; componentId: string } }
) {
  try {
    await connectDB();

    const { id: hostelId, componentId } = params;

    // Check if component exists
    const component = await RoomComponent.findOne({
      _id: componentId,
      hostelId,
    });

    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }

    // Check if any room types are using this component
    const roomTypesUsingComponent = await RoomType.countDocuments({
      hostelId,
      components: componentId,
    });

    if (roomTypesUsingComponent > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete component. It is being used by ${roomTypesUsingComponent} room type(s). Please remove this component from all room types first.`,
          roomTypesUsingComponent 
        },
        { status: 400 }
      );
    }

    // If no room types are using this component, proceed with deletion
    await RoomComponent.findOneAndDelete({
      _id: componentId,
      hostelId,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Component deleted successfully',
      data: component 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
