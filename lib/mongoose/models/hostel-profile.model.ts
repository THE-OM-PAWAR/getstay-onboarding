import mongoose, { Document, Model, Schema } from 'mongoose';

interface HostelPhoto {
  url: string;
  title: string;
  description?: string;
  type: 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities';
  isMain?: boolean;
}

export interface IHostelProfile extends Document {
  hostel: mongoose.Types.ObjectId;
  slug?: string;
  city?: mongoose.Types.ObjectId;
  isOnlinePresenceEnabled: boolean;
  basicInfo: {
    name: string;
    description?: string;
    address?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    contactNumber?: string;
    email?: string;
  };
  propertyDetails: {
    totalFloors?: number;
    totalRooms?: number;
    accommodationType?: 'boys' | 'girls' | 'coed' | 'separate';
    establishedYear?: number;
    buildingType?: 'independent' | 'apartment' | 'commercial';
  };
  locationInfo: {
    googleMapLink?: string;
    latitude?: number;
    longitude?: number;
    nearbyLandmarks: Array<{
      name: string;
      distance: string;
      type: 'hospital' | 'school' | 'market' | 'transport' | 'other';
    }>;
    transportConnectivity: Array<{
      mode: 'bus' | 'metro' | 'train' | 'auto';
      distance: string;
      details: string;
    }>;
  };
  media: {
    photos: HostelPhoto[];
    virtualTourLink?: string;
  };
  amenities: Array<{
    name: string;
    available: boolean;
    description?: string;
    floor?: string;
  }>;
  safetyFeatures: Array<{
    feature: string;
    available: boolean;
    details?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const hostelPhotoSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['boys', 'girls', 'common', 'exterior', 'interior', 'amenities'],
    required: true,
  },
  isMain: { type: Boolean, default: false },
});

const hostelProfileSchema = new Schema<IHostelProfile>(
  {
    hostel: {
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: false,
    },
    isOnlinePresenceEnabled: {
      type: Boolean,
      default: true,
    },
    basicInfo: {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      address: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      contactNumber: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    propertyDetails: {
      totalFloors: { type: Number, min: 1, default: 1 },
      totalRooms: { type: Number, min: 1, default: 1 },
      accommodationType: {
        type: String,
        enum: ['boys', 'girls', 'coed', 'separate'],
        default: 'boys',
      },
      establishedYear: { type: Number },
      buildingType: {
        type: String,
        enum: ['independent', 'apartment', 'commercial'],
        default: 'independent',
      },
    },
    locationInfo: {
      googleMapLink: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      nearbyLandmarks: [{
        name: { type: String, required: true },
        distance: { type: String, required: true },
        type: {
          type: String,
          enum: ['hospital', 'school', 'market', 'transport', 'other'],
          required: true,
        },
      }],
      transportConnectivity: [{
        mode: {
          type: String,
          enum: ['bus', 'metro', 'train', 'auto'],
          required: true,
        },
        distance: { type: String, required: true },
        details: { type: String, required: true },
      }],
    },
    media: {
      photos: [hostelPhotoSchema],
      virtualTourLink: { type: String },
    },
    amenities: [{
      name: { type: String, required: true },
      available: { type: Boolean, default: true },
      description: { type: String },
      floor: { type: String },
    }],
    safetyFeatures: [{
      feature: { type: String, required: true },
      available: { type: Boolean, default: true },
      details: { type: String },
    }],
  },
  {
    timestamps: true,
  }
);

// Delete the model if it exists to ensure schema updates are applied
if (mongoose.models.HostelProfile) {
  delete mongoose.models.HostelProfile;
}

export const HostelProfile = mongoose.model<IHostelProfile>('HostelProfile', hostelProfileSchema);