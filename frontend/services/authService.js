import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { ref } from 'vue';
import router from '../src/router'; 
import { useAuth } from '../src/composables/useAuth';

const BASE_URL = import.meta.env.VITE_API_URL;


const username = ref('');
const email = ref('');
const password = ref('');

export const login = async ({ username, password }) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            username,
            password,
        });

        const token = response.data.token;
        localStorage.setItem('authToken', token);

        const { setToken } = useAuth();
        setToken(token);

        router.push('/dashboard');

        console.log('Connexion réussie', token);
      
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
