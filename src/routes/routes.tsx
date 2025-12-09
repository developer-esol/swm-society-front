import type { RouteObject } from 'react-router-dom';
import { MainLayout, GuestLayout, AdminLayout } from '../layouts';
import { HomePage } from '../pages';
import ProjectZeroStoryPage from '../pages/ProjectZeroStoryPage';
import GuestHomePage from '../pages/GuestHomePage';
import ThomasMushetStoryPage from '../pages/ThomasMushetStoryPage';
import HereMyVoiceStoryPage from '../pages/HereMyVoiceStoryPage';
import Shop from '../pages/ShopPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CommunityPage from '../pages/CommunityPage';
import WishlistPage from '../pages/WishlistPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CheckoutPage from '../pages/CheckoutPage';
import ShippingInfoPage from '../pages/ShippingInfoPage';
import ReturnPolicyPage from '../pages/ReturnPolicyPage';
import LoyaltyWalletPage from '../pages/LoyaltyWalletPage';
import YourOrdersPage from '../pages/YourOrdersPage';
import YourPostsPage from '../pages/YourPostsPage';
import GoogleAuthCallback from '../pages/GoogleAuthCallback';
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminProducts from '../pages/Admin/AdminProducts'
import AddProduct from '../pages/Admin/AddProduct'
import AdminStock from '../pages/Admin/AdminStock'
import AddStock from '../pages/Admin/AddStock'
import AdminReviews from '../pages/Admin/AdminReviews'
import AdminCommunityPosts from '../pages/Admin/AdminCommunityPosts'
import AdminUsers from '../pages/Admin/AdminUsers'
import AdminAccessControl from '../pages/Admin/AdminAccessControl'
import AddAccessControlUser from '../pages/Admin/AddAccessControlUser'
import EditAccessControlUser from '../pages/Admin/EditAccessControlUser'
import AdminLoyalty from '../pages/Admin/AdminLoyalty'
import AdminSales from '../pages/Admin/AdminSales'
import AdminRoles from '../pages/Admin/AdminRoles'
import PermissionLevels from '../pages/Admin/PermissionLevels'
import RoleCreation from '../pages/Admin/RoleCreation'
import AdminProfilePage from '../pages/Admin/AdminProfilePage'
import NotFoundPage from '../pages/NotFoundPage';


export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetailsPage />,
      },
      {
        path: 'community',
        element: <CommunityPage />,
      },
      {
        path: 'project-zero-story',
        element: <ProjectZeroStoryPage />,
      },
      {
        path: 'thomas-mushet-story',
        element: <ThomasMushetStoryPage />,
      },
      {
        path: 'hear-my-voice-story',
        element: <HereMyVoiceStoryPage />,
      },
      {
        path: 'project-zero-shop',
        element: <HereMyVoiceStoryPage />,
      },{
        path: 'thomas-mushet-shop',
        element: <HereMyVoiceStoryPage />,
      },
      {
        path: 'hear-my-voice-shop',
        element: <HereMyVoiceStoryPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'auth/google/callback',
        element: <GoogleAuthCallback />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'shipping-info',
        element: <ShippingInfoPage />,
      },
      {
        path: 'return-policy',
        element: <ReturnPolicyPage />,
      },
      {
        path: 'wishlist',
        element: <WishlistPage />,
      },
      {
        path: 'loyalty-wallet',
        element: <LoyaltyWalletPage />,
      },
      {
        path: 'orders',
        element: <YourOrdersPage />,
      },
      {
        path: 'posts',
        element: <YourPostsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'add-product',
        element: <AddProduct />,
      },
      {
        path: 'stock',
        element: <AdminStock />,
      },
      {
        path: 'add-stock',
        element: <AddStock />,
      },
      {
        path: 'reviews',
        element: <AdminReviews />,
      },
      {
        path: 'posts',
        element: <AdminCommunityPosts />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'access-control',
        element: <AdminAccessControl />,
      },
      {
        path: 'add-access-control-user',
        element: <AddAccessControlUser />,
      },
      {
        path: 'edit-access-control-user/:userId',
        element: <EditAccessControlUser />,
      },
      {
        path: 'loyalty',
        element: <AdminLoyalty />,
      },
      {
        path: 'sales',
        element: <AdminSales />,
      },
      {
        path: 'roles',
        element: <AdminRoles />,
      },
      {
        path: 'permission-levels/:roleId',
        element: <PermissionLevels />,
      },
      {
        path: 'role-creation',
        element: <RoleCreation />,
      },
      {
        path: 'profile',
        element: <AdminProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/guest',
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <GuestHomePage />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'community',
        element: <CommunityPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'wishlist',
        element: <WishlistPage />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetailsPage />,
      },
      {
        path: 'project-zero-story',
        element: <ProjectZeroStoryPage />,
      },
      {
        path: 'thomas-mushet-story',
        element: <ThomasMushetStoryPage />,
      },
      {
        path: 'hear-my-voice-story',
        element: <HereMyVoiceStoryPage />,
      },
    ],
  },
];