import { reactive, readonly } from 'vue';
import { jwtDecode } from 'jwt-decode';

type DecodedTokenPaylad = {
    id: number,
    is_admin: boolean;
    type: string;
    exp: number
};

const state = reactive({
  token: null as string | null,
  refreshToken: null as string | null,
  decodedToken: null as DecodedTokenPaylad | null,
  keepConnected: false,
  autoRefreshTimer: null as NodeJS.Timeout | null,
});

// Auto-refresh token when it's close to expiry (dynamic margin based on token duration)
const calculateRefreshMargin = (tokenDuration: number) => {
  // For tokens < 1 hour, refresh at 80% of duration
  // For tokens >= 1 hour, refresh 1 hour before
  if (tokenDuration < 3600) { // Less than 1 hour
    return Math.floor(tokenDuration * 0.2); // Refresh at 20% remaining (80% used)
  }
  return 3600; // 1 hour for longer tokens
};

export default {
  state: readonly(state), // Make state readonly to prevent accidental mutations
  setTokens(accessToken: string, refreshToken: string, keepConnected: boolean = false) {
    state.token = accessToken;
    state.refreshToken = refreshToken;
    state.decodedToken = jwtDecode<DecodedTokenPaylad>(accessToken);
    state.keepConnected = keepConnected;
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('keepConnected', JSON.stringify(keepConnected));
    
    // Set up auto-refresh if keep connected is enabled
    if (keepConnected) {
      this.setupAutoRefresh();
    } else {
      this.clearAutoRefresh();
    }
  },
  setToken(newToken: string, keepConnected: boolean = false) {
    // Backward compatibility - when only access token is provided
    state.token = newToken;
    state.decodedToken = jwtDecode<DecodedTokenPaylad>(newToken);
    state.keepConnected = keepConnected;
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('keepConnected', JSON.stringify(keepConnected));
    
    if (keepConnected) {
      this.setupAutoRefresh();
    } else {
      this.clearAutoRefresh();
    }
  },
  clearToken() {
    state.token = null;
    state.refreshToken = null;
    state.decodedToken = null;
    state.keepConnected = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('keepConnected');
    this.clearAutoRefresh();
  },
  loadTokenFromStorage() {
    const savedToken = localStorage.getItem('authToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedKeepConnected = localStorage.getItem('keepConnected');
    
    if (savedToken) {
      // Debug: Show token info
      try {
        const decoded = jwtDecode<DecodedTokenPaylad>(savedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp - currentTime;
        console.log('Token loaded from storage:', {
          expiresIn: `${Math.floor(expiresIn / 3600)}h ${Math.floor((expiresIn % 3600) / 60)}m`,
          expiresAt: new Date(decoded.exp * 1000).toLocaleString(),
          isValid: expiresIn > 0
        });
      } catch (e) {
        console.log('Invalid token in storage:', e);
      }
      
      // Verify if token is still valid before setting it
      if (this.isTokenValid(savedToken)) {
        const keepConnected = savedKeepConnected ? JSON.parse(savedKeepConnected) : false;
        if (savedRefreshToken) {
          this.setTokens(savedToken, savedRefreshToken, keepConnected);
        } else {
          this.setToken(savedToken, keepConnected);
        }
      } else {
        // Token is expired, try to refresh if we have refresh token and keep connected is enabled
        const keepConnected = savedKeepConnected ? JSON.parse(savedKeepConnected) : false;
        if (keepConnected && savedRefreshToken) {
          this.attemptAutoRefresh();
        } else {
          // Token is expired, clear it
          this.clearToken();
        }
      }
    }
  },
  isTokenValid(token?: string): boolean {
    try {
      const tokenToCheck = token || state.token;
      if (!tokenToCheck) return false;
      
      const decoded = jwtDecode<DecodedTokenPaylad>(tokenToCheck);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  isAuthenticated(): boolean {
    return !!state.token && this.isTokenValid();
  },
  setupAutoRefresh() {
    this.clearAutoRefresh(); // Clear any existing timer
    
    if (!state.decodedToken) return;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenDuration = state.decodedToken.exp - currentTime;
    const refreshMargin = calculateRefreshMargin(tokenDuration);
    const timeUntilRefresh = (state.decodedToken.exp - currentTime - refreshMargin) * 1000;
    
    console.log('Auto-refresh setup:', {
      tokenDuration: `${Math.floor(tokenDuration / 60)}m ${tokenDuration % 60}s`,
      refreshMargin: `${Math.floor(refreshMargin / 60)}m ${refreshMargin % 60}s`,
      timeUntilRefresh: `${Math.floor(timeUntilRefresh / 1000 / 60)}m ${Math.floor((timeUntilRefresh / 1000) % 60)}s`,
      willRefresh: timeUntilRefresh > 0
    });
    
    if (timeUntilRefresh > 0) {
      state.autoRefreshTimer = setTimeout(() => {
        console.log('Auto-refresh triggered by timer');
        this.attemptAutoRefresh();
      }, timeUntilRefresh);
    } else {
      console.log('Token too close to expiry, no auto-refresh timer set');
    }
  },
  clearAutoRefresh() {
    if (state.autoRefreshTimer) {
      clearTimeout(state.autoRefreshTimer);
      state.autoRefreshTimer = null;
    }
  },
  async attemptAutoRefresh() {
    console.log('attemptAutoRefresh called');
    
    if (!state.refreshToken || !state.keepConnected) {
      console.log('No refresh token or keep connected disabled, clearing token');
      this.clearToken();
      return false;
    }
    
    try {
      console.log('Attempting to refresh token...');
      // Dynamic import to avoid circular dependency
      const api = await import('@/api');
      const result = await api.default.post('/user/refresh', {
        refreshToken: state.refreshToken,
      });
      
      const { token } = result.data;
      this.setTokens(token, state.refreshToken, true); // Keep the refresh token and keep connected state
      
      // Optional: Show a subtle notification that session was renewed
      console.log('Session automatically renewed');
      
      return true;
    } catch (error) {
      console.error('Auto-refresh failed:', error);
      this.clearToken();
      
      // Redirect to login
      const router = await import('../router');
      if (router.default.currentRoute.value.name !== 'Login') {
        router.default.push({ name: 'Login' });
      }
      return false;
    }
  },
};
