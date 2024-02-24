import { Schema, model } from 'mongoose';
import { TTheme } from './theme.interface';

const themeSchema = new Schema<TTheme>(
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

export const ThemeModel = model<TTheme>('themes', themeSchema);
