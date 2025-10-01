import mongoose, { Document, Model, Schema } from 'mongoose';

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

export interface IRoomType extends Document {
  name: string;
  description: string;
  components: any[];
  rent: number;
  blockId: string;
  images: RoomTypeImage[];
  createdAt: Date;
  updatedAt: Date;
}

const roomTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    components: [{
      type: Schema.Types.ObjectId,
      ref: 'RoomComponent',
    }],
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    blockId: {
      type: String,
      required: true,
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

export const RoomType = (mongoose.models.RoomType as Model<IRoomType>) ||
  mongoose.model<IRoomType>('RoomType', roomTypeSchema);