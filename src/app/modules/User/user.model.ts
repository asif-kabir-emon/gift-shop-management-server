import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            default: 'seller',
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const UserModel = model<TUser>('users', userSchema);
