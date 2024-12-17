<template>
    <div class="login">
        <h1>Connexion</h1>
        <form action="" method="get" @submit.prevent="login">
        <div class="form-slot">
            <label for="email">Email</label>
            <input type="email" placeholder="">
        </div>
        <div class="form-slot">
            <label for="password">Password</label>
            <input type="password" placeholder="">
        </div>
        <span class="forgot-password">Mot de passe oublié ?</span>
        <div class="signs">
            <div @click="singIn" class="signIn">Se connecter</div>
            <div class="signUp">S'inscrire</div>
            <div class="demo">Démo</div>
        </div>
        </form>
    </div>
    
</template>


<script setup>
import { ref } from 'vue';

const signIn = () => {
    return console.log("Connexion !")
}

</script>

<style scooped>

.login {
    height: 100%;
    width: 100%;
}

h1{
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

.form-slot{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-slot input{
    padding: 0.5rem 0 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid #d9d9d9;

}

.form-slot input:focus{
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