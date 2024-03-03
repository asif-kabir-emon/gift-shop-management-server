import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { OccasionRoutes } from '../modules/Occasion/occasion.route';
import { ThemeRoutes } from '../modules/Theme/theme.route';
import { BrandRoutes } from '../modules/Brand/brand.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { SaleInfoRoutes } from '../modules/SellInfo/sellInfo.route';
import { CouponRoutes } from '../modules/Coupon/coupon.route';
import { InvoiceRoutes } from '../modules/Invoice/Invoice.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/user',
        route: UserRoutes,
    },
    {
        path: '/category',
        route: CategoryRoutes,
    },
    {
        path: '/occasion',
        route: OccasionRoutes,
    },
    {
        path: '/theme',
        route: ThemeRoutes,
    },
    {
        path: '/brand',
        route: BrandRoutes,
    },
    {
        path: '/product',
        route: ProductRoutes,
    },
    {
        path: '/sale-info',
        route: SaleInfoRoutes,
    },
    {
        path: '/coupon',
        route: CouponRoutes,
    },
    {
        path: '/invoice',
        route: InvoiceRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
