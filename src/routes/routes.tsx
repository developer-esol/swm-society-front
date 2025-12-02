import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { HomePage } from '../pages';
import ProjectZeroStoryPage from '../pages/ProjectZeroStoryPage';
import ThomasMushetStoryPage from '../pages/ThomasMushetStoryPage';
import HereMyVoiceStoryPage from '../pages/HereMyVoiceStoryPage';
import Shop from '../pages/ShopPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CommunityPage from '../pages/CommunityPage';
import WishlistPage from '../pages/WishlistPage';
import CartPage from '../pages/CartPage';
import LoyaltyWalletPage from '../pages/LoyaltyWalletPage';
import YourOrdersPage from '../pages/YourOrdersPage';
import YourPostsPage from '../pages/YourPostsPage';


// Temporary placeholder components - replace with actual imports when components are created
const LoginPage = () => <div><h1>Login</h1></div>;
const NotFoundPage = () => <div><h1>404 - Page Not Found</h1></div>;

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
        path: 'cart',
        element: <CartPage />,
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
];