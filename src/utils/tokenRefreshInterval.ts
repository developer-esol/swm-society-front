/**
 * Periodic token refresh utility
 * Checks token expiration every minute and refreshes if needed
 */

let refreshIntervalId: number | null = null;

const isTokenExpiringSoon = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 120; // 2 minutes buffer
    
    return payload.exp < (currentTime + bufferTime);
  } catch (error) {
    console.error('[TokenRefresh] Error checking token:', error);
    return false;
  }
};

const refreshTokenIfNeeded = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');
  const authToken = localStorage.getItem('authToken');

  // Only refresh if user is logged in
  if (!authToken || !refreshToken) {
    return;
  }

  if (isTokenExpiringSoon()) {
    console.log('[TokenRefresh] ⏰ Token expiring soon, refreshing in background...');
    
    try {
      const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE || 'http://localhost:8080';
      
      const response = await fetch(`${AUTH_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const tokenData = data.data || data;

      if (tokenData.accessToken) {
        localStorage.setItem('authToken', tokenData.accessToken);
        console.log('[TokenRefresh] ✅ Token refreshed successfully in background');
      }

      if (tokenData.refreshToken) {
        localStorage.setItem('refreshToken', tokenData.refreshToken);
      }
    } catch (error) {
      console.error('[TokenRefresh] ❌ Background refresh failed:', error);
    }
  }
};

export const startTokenRefreshInterval = (): void => {
  // Clear existing interval if any
  stopTokenRefreshInterval();

  // Check token every minute
  refreshIntervalId = setInterval(() => {
    void refreshTokenIfNeeded();
  }, 60000); // 60 seconds

  console.log('[TokenRefresh] Started periodic token refresh (every 1 minute)');
};

export const stopTokenRefreshInterval = (): void => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
    console.log('[TokenRefresh] Stopped periodic token refresh');
  }
};
