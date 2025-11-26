import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { OrganisationProfile } from '@/lib/mongoose/models/organisation-profile.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const profile = await OrganisationProfile.findOne({ organisation: params.organisationId });

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
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const existingProfile = await OrganisationProfile.findOne({ organisation: params.organisationId });

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    const profile = await OrganisationProfile.create({
      ...body,
      organisation: params.organisationId,
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
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const profile = await OrganisationProfile.findOneAndUpdate(
      { organisation: params.organisationId },
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
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const profile = await OrganisationProfile.findOneAndDelete({ organisation: params.organisationId });

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
