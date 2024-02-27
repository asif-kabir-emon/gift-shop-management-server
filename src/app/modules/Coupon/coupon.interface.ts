export type TCoupon = {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
    minOrder: number;
    haveMaxDiscount: boolean;
    maxDiscount?: number;
    startDate: string;
    expiryDate: string;
    isDeleted?: boolean;
};
