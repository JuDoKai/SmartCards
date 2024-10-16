<template>
    <h1>Connexion</h1>
    <form action="" method="get" @submit.prevent="">
    <div class="form-slot">
        <label for="mail">Email</label>
        <input type="mail">
    </div>
    <div class="form-slot">
        <label for="password">Password</label>
        <input type="password" placeholder="">
    </div>
    <span class="forgot-password">Mot de passe oublié ?</span>
    <div class="signs">
        <div class="signIn">Se connecter</div>
        <div class="signUp">S'inscrire</div>
    </div>
    </form>

   
</template>



<script setup>

</script>

<style>

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
    outline: none;
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
    gap: 1rem;
    width: 65%;
}

.signIn {
    display: flex;
    justify-content: center;
    color: #f5f5f5;
    background-color: #2c2c2c;
    border-radius: 0.75rem;
    padding: 1rem 3rem;
    flex: 50%;
    max-width: 12rem;
    white-space: nowrap;
}

.signUp {
    display: flex;
    justify-content: center;
    color: #f5f5f5;
    background-color: #2c2c2c;
    border-radius: 0.75rem;
    padding: 1rem 3rem;
    flex: 50%;
    max-width: 12rem;
}

</style>