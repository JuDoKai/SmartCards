import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');

export const login = async ({ username, password }) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/login', {
            username,
            password,
        });

        const token = response.data.token;
        localStorage.setItem('authToken', token);

        console.log('Connexion réussie', token);
        /*
        const decoded = jwtDecode(token);
        console.log(decoded.userId);
        */
        return token;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw new Error('Erreur lors de la connexion. Vérifiez vos identifiants.');
    }
};

export const register = async ({ username, email, password }) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', {
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