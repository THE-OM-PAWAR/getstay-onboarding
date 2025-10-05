import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoomComponent {
  name: string;
  description: string;
  blockId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoomComponentDocument extends IRoomComponent, Document {}

const roomComponentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a component name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    blockId: {
      type: String,
      required: [true, 'Please provide a block ID'],
    },
  },
  {
    timestamps: true,
  }
);

export const RoomComponent = (mongoose.models.RoomComponent as Model<IRoomComponentDocument>) ||
  mongoose.model<IRoomComponentDocument>('RoomComponent', roomComponentSchema);