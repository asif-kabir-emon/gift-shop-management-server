export type TUser = {
    name: string;
    email: string;
    password: string;
    role?: 'user';
    isVerified?: boolean;
    isDeleted?: boolean;
};
