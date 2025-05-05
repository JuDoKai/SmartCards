import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async ({ username, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
    });

    const token = response.data.token;
    const authStore = useAuthStore();
    authStore.setToken(token);

    console.log('Connexion réussie');
    return token;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw new Error('Erreur lors de la connexion. Vérifiez vos identifiants.');
  }
};

export const register = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      username,
      email,
      password,
    });

    console.log('Inscription réussie');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw new Error('Erreur lors de l\'inscription. Vérifiez vos informations.');
  }
};
