import { Schema, model, Types } from 'mongoose';
const interestSchema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
// prevent duplicates (client can't mark same property twice)
interestSchema.index({ propertyId: 1, clientId: 1 }, { unique: true });
export const Interest = model('Interest', interestSchema);
