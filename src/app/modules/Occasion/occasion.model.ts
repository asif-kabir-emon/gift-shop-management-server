import { Schema, model } from 'mongoose';
import { TOccasion } from './occasion.interface';

const occasionSchema = new Schema<TOccasion>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const OccasionModel = model('occasions', occasionSchema);
