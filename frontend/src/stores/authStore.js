// stores/authStore.js
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('authToken', token);
      this.user = jwtDecode(token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
    },
    restoreUser() {
      if (this.token) {
        try {
          this.user = jwtDecode(this.token);
        } catch (e) {
          this.logout()
        }
      }
    },
  },
});
