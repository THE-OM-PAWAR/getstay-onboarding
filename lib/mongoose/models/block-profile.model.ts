import mongoose, { Document, Model, Schema } from 'mongoose';

interface BlockPhoto {
  url: string;
  title: string;
  description?: string;
  type: 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities';
  isMain?: boolean;
}

interface Landmark {
  name: string;
  distance: string;
  type: 'hospital' | 'school' | 'market' | 'transport' | 'other';
}

interface Transport {
  mode: 'bus' | 'metro' | 'train' | 'auto';
  distance: string;
  details: string;
}

interface Amenity {
  name: string;
  available: boolean;
  description?: string;
  floor?: string;
}

interface SafetyFeature {
  feature: string;
  available: boolean;
  details?: string;
}

export interface IBlockProfile extends Document {
  block: mongoose.Types.ObjectId;
  basicInfo: {
    name: string;
    description: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    totalFloors: number;
    totalRooms: number;
    accommodationType: 'boys' | 'girls' | 'coed' | 'separate';
    establishedYear?: number;
    buildingType: 'independent' | 'apartment' | 'commercial';
  };
  locationInfo: {
    googleMapLink?: string;
    latitude?: number;
    longitude?: number;
    nearbyLandmarks: Landmark[];
    transportConnectivity: Transport[];
  };
  media: {
    photos: BlockPhoto[];
    virtualTourLink?: string;
  };
  amenities: Amenity[];
  safetyFeatures: SafetyFeature[];
  createdAt: Date;
  updatedAt: Date;
}

const blockPhotoSchema = new Schema({
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

const landmarkSchema = new Schema({
  name: { type: String, required: true },
  distance: { type: String, required: true },
  type: {
    type: String,
    enum: ['hospital', 'school', 'market', 'transport', 'other'],
    required: true,
  },
});

const transportSchema = new Schema({
  mode: {
    type: String,
    enum: ['bus', 'metro', 'train', 'auto'],
    required: true,
  },
  distance: { type: String, required: true },
  details: { type: String, required: true },
});

const amenitySchema = new Schema({
  name: { type: String, required: true },
  available: { type: Boolean, default: false },
  description: { type: String },
  floor: { type: String },
});

const safetyFeatureSchema = new Schema({
  feature: { type: String, required: true },
  available: { type: Boolean, default: false },
  details: { type: String },
});

const blockProfileSchema = new Schema<IBlockProfile>(
  {
    block: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
      unique: true,
    },
    basicInfo: {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      address: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    propertyDetails: {
      totalFloors: { type: Number, required: true, min: 1 },
      totalRooms: { type: Number, required: true, min: 1 },
      accommodationType: {
        type: String,
        enum: ['boys', 'girls', 'coed', 'separate'],
        required: true,
      },
      establishedYear: { type: Number, min: 1900, max: new Date().getFullYear() },
      buildingType: {
        type: String,
        enum: ['independent', 'apartment', 'commercial'],
        required: true,
      },
    },
    locationInfo: {
      googleMapLink: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      nearbyLandmarks: [landmarkSchema],
      transportConnectivity: [transportSchema],
    },
    media: {
      photos: [blockPhotoSchema],
      virtualTourLink: { type: String },
    },
    amenities: [amenitySchema],
    safetyFeatures: [safetyFeatureSchema],
  },
  {
    timestamps: true,
  }
);

export const BlockProfile = (mongoose.models.BlockProfile as Model<IBlockProfile>) ||
  mongoose.model<IBlockProfile>('BlockProfile', blockProfileSchema);