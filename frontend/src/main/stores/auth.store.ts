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
  decodedToken: null as DecodedTokenPaylad | null,
});

export default {
  state: readonly(state), // Make state readonly to prevent accidental mutations
  setToken(newToken: string) {
    state.token = newToken;
    state.decodedToken = jwtDecode<DecodedTokenPaylad>(newToken);
    localStorage.setItem('authToken', newToken); // Persist token in localStorage
  },
  clearToken() {
    state.token = null;
    state.decodedToken = null;
    localStorage.removeItem('authToken');
  },
  loadTokenFromStorage() {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      this.setToken(savedToken);
    }
  },
};
