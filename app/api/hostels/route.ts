import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { Hostel } from '@/lib/mongoose/models/hostel.model';
import mongoose from 'mongoose';

// Dummy owner ID for demo purposes - in production, this should come from authentication
const DUMMY_OWNER_ID = '507f1f77bcf86cd799439011';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Use a consistent dummy ObjectId for demo purposes
    const dummyOwnerId = new mongoose.Types.ObjectId(DUMMY_OWNER_ID);
    const hostels = await Hostel.find({ owner: dummyOwnerId })
      .sort({ createdAt: -1 });

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
    await connectDB();

    const body = await request.json();
    const { name, ownerName } = body;

    if (!name || !ownerName) {
      return NextResponse.json(
        { success: false, error: 'Name and owner name are required' },
        { status: 400 }
      );
    }

    // Use the same consistent dummy ObjectId for demo purposes
    const dummyOwnerId = new mongoose.Types.ObjectId(DUMMY_OWNER_ID);
    const hostel = await Hostel.create({
      name,
      owner: dummyOwnerId,
      users: [],
      joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    return NextResponse.json({ success: true, data: hostel }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
