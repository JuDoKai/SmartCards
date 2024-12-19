<template>
    <div class="login">
        <h1>Connexion</h1>
        <form @submit.prevent="login">
            <div class="form-slot">
                <label for="email">Email</label>
                <input type="email" v-model="email" placeholder="Entrez votre email" required />
            </div>
            <div class="form-slot">
                <label for="password">Mot de passe</label>
                <input type="password" v-model="password" placeholder="Entrez votre mot de passe" required />
            </div>
            <span class="forgot-password">Mot de passe oublié ?</span>
            <div class="signs">
                <div @click="login" class="signIn">Se connecter</div>
                <div class="signUp">S'inscrire</div>
                <div class="demo">Démo</div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('authToken');
const decoded = jwtDecode(token);

console.log(decoded); // { userId: '123', exp: 1672531200, ... }

const router = useRouter(); 
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
    try {
        const response = await axios.post('http://localhost:5000/auth/login', {
            username: email.value,
            password: password.value
        });

        const token = response.data.token;
        
        localStorage.setItem('authToken', token);
        
        router.push('/dashboard');

        console.log('Connexion réussie', token);

        
    } catch (error) {
        errorMessage.value = 'Erreur lors de la connexion. Vérifiez vos identifiants.';
        console.error('Erreur de connexion:', error);
    }
};
</script>

<style scoped>
.login {
    height: 100%;
    width: 100%;
}

h1 {
    padding-left: 1.5rem;
}

form {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border: 2px solid #d9d9d9;
    border-radius: 5px;
}

.form-slot {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-slot input {
    padding: 0.5rem 0 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid #d9d9d9;
}

.form-slot input:focus {
    outline: 2px solid;
}

.forgot-password {
    cursor: pointer;
}

.forgot-password:hover {
    text-decoration: underline;
    text-decoration-thickness: 0.1rem;
}

.signs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.signIn,
.signUp,
.demo {
    display: flex;
    justify-content: center;
    color: #f5f5f5;
    background-color: #2c2c2c;
    border-radius: 0.75rem;
    padding: 1rem 2rem;
    white-space: nowrap;
    cursor: pointer;
}

.signIn:hover,
.signUp:hover,
.demo:hover {
    background-color: #464646;
}
</style>
