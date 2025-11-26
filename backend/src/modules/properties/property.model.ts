import { Schema, model, Types } from 'mongoose';

const locationSchema = new Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  lat: { type: Number },
  lng: { type: Number },
}, { _id: false });

export interface IProperty {
  title: string;
  description?: string;
  price: number;
  location: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  images?: string[];
  amenities?: string[];
  status?: 'available' | 'sold' | 'pending';
  agentId: Types.ObjectId;
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: locationSchema, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  areaSqFt: { type: Number },
  images: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
  agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

propertySchema.index({ title: 'text', description: 'text', 'location.city': 1 });

export const Property = model<IProperty>('Property', propertySchema);
