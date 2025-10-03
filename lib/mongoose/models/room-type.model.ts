import mongoose, { Document, Model, Schema } from 'mongoose';

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

export interface IRoomType {
  name: string;
  description: string;
  components: mongoose.Types.ObjectId[];
  rent: number;
  blockId: string;
  images: RoomTypeImage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoomTypeDocument extends IRoomType, Document {}

const roomTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a room type name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    components: {
      type: [Schema.Types.ObjectId],
      ref: 'RoomComponent',
      required: [true, 'Please provide at least one component'],
    },
    rent: {
      type: Number,
      required: [true, 'Please provide the monthly rent'],
      min: 0,
    },
    blockId: {
      type: String,
      required: [true, 'Please provide a block ID'],
    },
    images: [{
      url: { type: String, required: true },
      title: { type: String, required: true },
      isCover: { type: Boolean, default: false },
    }],
  },
  {
    timestamps: true,
  }
);

export const RoomType = (mongoose.models.RoomType as Model<IRoomTypeDocument>) ||
  mongoose.model<IRoomTypeDocument>('RoomType', roomTypeSchema);