
import React, { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { theme } from './theme'
import { router } from './routes'
import { useAuthStore } from './store/useAuthStore'
import './App.css'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 50 * 100,
      gcTime: 15 * 50 * 100,
      retry: false,
      refetchOnWindowFocus: false
    }
  }
});

// PayPal Script Provider options
const paypalOptions = {
  // PayPal SDK expects the query param `client-id` (with a hyphen)
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'GBP',
  intent: 'capture',
  components: 'buttons',
  // Workaround: disable the in-popup card/credit fields which sometimes fail in sandbox.
  // This forces the PayPal login/approval flow instead of guest card capture.
  // If you need card payments, remove this and ensure your sandbox merchant is configured.
  'disable-funding': 'card',
};

// Log options so it's easy to verify which clientId / flags the app is using
console.log('[App] PayPal provider options:', paypalOptions);

// Authentication initializer component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* key forces remount of the provider (and reload of the PayPal script) when client id changes */}
      <PayPalScriptProvider key={paypalOptions['client-id']} options={paypalOptions}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </ThemeProvider>
      </PayPalScriptProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
