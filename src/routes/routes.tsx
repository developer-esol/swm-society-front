import type { RouteObject } from 'react-router-dom';
import { MainLayout, GuestLayout } from '../layouts';
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
    element: <AdminDashboard />,
  },
  {
    path: '/admin/products',
    element: <AdminProducts />,
  },
  {
    path: '/admin/add-product',
    element: <AddProduct />,
  },
  {
    path: '/admin/stock',
    element: <AdminStock />,
  },
  {
    path: '/admin/add-stock',
    element: <AddStock />,
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