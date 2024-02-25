export type TUser = {
    name: string;
    email: string;
    password: string;
    role?: 'seller' | 'manager' | 'super-admin';
    isVerified?: boolean;
    isDeleted?: boolean;
};
