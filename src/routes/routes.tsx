import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { HomePage } from '../pages';
import ProjectZeroStoryPage from '../pages/ProjectZeroStoryPage';
import ThomasMushetStoryPage from '../pages/ThomasMushetStoryPage';
import HereMyVoiceStoryPage from '../pages/HereMyVoiceStoryPage';
import Shop from '../pages/ShopPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';


// Temporary placeholder components - replace with actual imports when components are created
const Community = () => <div><h1>Community</h1></div>;
const LoginPage = () => <div><h1>Login</h1></div>;
const CartPage = () => <div><h1>Cart</h1></div>;
const WishlistPage = () => <div><h1>Wishlist</h1></div>;
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
        element: <Community />,
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];