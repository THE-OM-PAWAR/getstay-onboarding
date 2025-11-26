import { NextRequest, NextResponse } from 'next/server';
import { Hostel } from '@/lib/mongoose/models/hostel.model';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';
import connectDB from '@/lib/mongoose/connection';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');

    if (!organisationId) {
      return NextResponse.json(
        { success: false, error: 'Organisation ID is required' },
        { status: 400 }
      );
    }

    const hostels = await Hostel.find({ organisation: organisationId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: hostels });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/hostels - Starting request');
    await connectDB();
    console.log('Database connected successfully');

    const body = await request.json();
    console.log('Request body:', body);
    const { name, description, organisationId } = body;

    if (!name || !organisationId) {
      return NextResponse.json(
        { success: false, error: 'Name and organisation ID are required' },
        { status: 400 }
      );
    }

    // Validate organisationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(organisationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid organisation ID format' },
        { status: 400 }
      );
    }

    const hostel = await Hostel.create({
      name,
      description,
      organisation: organisationId,
    });

    console.log('Hostel created successfully:', hostel._id);

    // Create basic room components for the new hostel
    const basicComponents = [
      { name: "Bed", description: "Single/double bed with mattress" },
      { name: "Study Table", description: "Wooden study table with drawers" },
      { name: "Chair", description: "Comfortable study chair" },
      { name: "Almirah/Wardrobe", description: "Storage wardrobe for clothes" },
      { name: "Ceiling Fan", description: "Electric ceiling fan" },
      { name: "Tube Light", description: "LED tube light for room lighting" },
      { name: "Dustbin", description: "Small waste bin for room" },
      { name: "Mirror", description: "Wall-mounted mirror" },
      { name: "Window Curtains", description: "Privacy curtains for windows" },
      { name: "Mattress", description: "Comfortable sleeping mattress" },
      { name: "Pillow", description: "Sleeping pillow with cover" },
      { name: "Blanket", description: "Warm blanket for sleeping" },
      { name: "Study Lamp", description: "Table lamp for reading" },
      { name: "Bookshelf", description: "Small shelf for books and items" },
    ];

    // Create all basic components for this hostel
    const componentsToCreate = basicComponents.map(component => ({
      ...component,
      hostelId: (hostel as any)._id.toString(),
    }));

    console.log('Creating room components for hostel:', hostel._id);
    await RoomComponent.insertMany(componentsToCreate);
    console.log('Room components created successfully');

    return NextResponse.json({ success: true, data: hostel }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hostel:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate entry. Please check your data.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create hostel' },
      { status: 500 }
    );
  }
}
