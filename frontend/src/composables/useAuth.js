import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

const token = ref(localStorage.getItem('authToken') || null);
const user = ref(token.value ? jwtDecode(token.value) : null);

const isAuthenticated = computed(() => !!user.value);

function setToken(newToken) {
  token.value = newToken;
  localStorage.setItem('authToken', newToken);
  user.value = jwtDecode(newToken);
}

function logout() {
  token.value = null;
  user.value = null;
  localStorage.removeItem('authToken');
}

function loadSession() {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    try {
      token.value = storedToken;
      user.value = jwtDecode(storedToken);
    } catch (err) {
      console.error('Invalid token:', err);
      logout();
    }
  }
}

export function useAuth() {
  return {
    token,
    user,
    isAuthenticated,
    setToken,
    logout,
    loadSession, 
  };
}
