import mongoose, { Document, Model, Schema } from 'mongoose';
import { INDIAN_STATES, IndianState } from '@/lib/constants/indian-states';

export interface ICity extends Document {
  name: string;
  slug: string;
  state: IndianState;
  introContent?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

function generateSlug(name: string): string {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const citySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a city name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    state: {
      type: String,
      enum: INDIAN_STATES,
      required: [true, 'Please provide a valid state'],
      trim: true,
    },
    introContent: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

citySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
  }
  next();
});

export const City =
  (mongoose.models.City as Model<ICity>) ||
  mongoose.model<ICity>('City', citySchema);

