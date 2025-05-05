import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('authToken', newToken);
      this.user = jwtDecode(newToken);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
    },

    checkToken() {
      if (this.token) {
        try {
          this.user = jwtDecode(this.token);
        } catch (error) {
          this.logout();
        }
      }
    },
  },
});
