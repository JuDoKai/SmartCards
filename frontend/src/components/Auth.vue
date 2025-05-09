<template>
    <div class="container">
        <div v-if="isLoginMode" class="login">
            <h1>Connexion</h1>
            <form>
                <div class="form-slot">
                    <label for="textOrEmail">Nom d'utilisateur Ou Email</label>
                    <input type="text" v-model="textOrEmail" required />
                    <div class="errorFeedback">{{ feedback }} </div>
                </div>
                <div class="form-slot">
                    <label for="password">Mot de passe</label>
                    <input type="password" v-model="password" required />
                    <div class="errorFeedback">{{ feedbackPassword }} </div>
                </div>
                <span class="forgot-password">Mot de passe oublié ?</span>
                <div class="signs">
                    <div @click="loginHandler" class="button">Se connecter</div>
                    <div @click="toggleMode" class="button">S'inscrire</div>
                    <div @click="demoAccess" class="button">Démo</div>
                </div>
            </form> 
        </div>

        <div v-else class="register">
            <h1>Inscription</h1>
            <form>
                <div class="form-slot">
                    <label for="name">Nom d'utilisateur</label>
                    <input type="text" v-model="name" required />
                <div class="errorFeedback">{{ feedbackUsername }}</div>
                </div>
                <div class="form-slot">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" required />
                </div>
                <div class="form-slot">
                    <label for="password">Mot de passe</label>
                    <input type="password" v-model="password" required />
                <div class="errorFeedback">{{ feedbackPassword }}</div>
                </div>
                <div class="form-slot">
                    <label for="confirmedPassword">Confirmation du mot de passe</label>
                    <input type="password" v-model="confirmedPassword" required />
                <div class="errorFeedback">{{ feedbackConfirmed }}</div>
                </div>

                <div class="errorFeedback">{{ errorMessage }}</div>

                <div class="signs">
                    <div @click="registerHandler" class="button">Valider</div>
                    <div @click="toggleMode" class="button">Retour</div>
                </div>
            </form>
        </div>
</div>

</template>
<script setup>
import router from '@/router';
import '@/assets/main.css';

import { login as loginService, register as registerService } from '../../services/authService';
import { ref, watch } from 'vue';

const isLoginMode = ref(true);
const textOrEmail = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const confirmedPassword = ref('');

const feedback = ref('');
const feedbackUsername = ref('');
const feedbackPassword = ref('');
const feedbackConfirmed = ref('');
const errorMessage = ref('');

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  name.value = '';
  email.value = '';
  password.value = '';
  confirmedPassword.value = '';
  feedback.value = '';
  feedbackUsername.value = '';
  feedbackPassword.value = '';
  feedbackConfirmed.value = '';
  errorMessage.value = '';
};

const validateUsername = (username) => {
  const usernameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9_]+$/;
  return usernameRegex.test(username);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-zA-ZÀ-ÖØ-öø-ÿ])(?=.*[A-ZÀ-ÖØ-Þ])(?=.*\d)(?=.*[^A-Za-zÀ-ÖØ-öø-ÿ0-9])[\S]{8,}$/;
  return passwordRegex.test(password);
};

watch(name, (newVal) => {
  if (!newVal) {
    feedbackUsername.value = '';
  } else if (!validateUsername(newVal)) {
    feedbackUsername.value = "Nom d'utilisateur invalide. Lettres, chiffres et _ uniquement, accents autorisés.";
  } else if (newVal.length < 3 || newVal.length > 20) {
    feedbackUsername.value = "Le nom d'utilisateur doit contenir entre 3 et 20 caractères.";
  } else {
    feedbackUsername.value = '';
  }
});

watch(password, (newVal) => {
  if (!newVal) {
    feedbackPassword.value = '';
  } else if (!validatePassword(newVal)) {
    feedbackPassword.value = "Mot de passe faible. Min. 8 caractères, majuscule, minuscule, chiffre et symbole.";
  } else {
    feedbackPassword.value = '';
  }
});

watch([password, confirmedPassword], ([newPass, newConfirmed]) => {
  if (!newConfirmed) {
    feedbackConfirmed.value = '';
  } else if (newPass !== newConfirmed) {
    feedbackConfirmed.value = "Les mots de passe ne correspondent pas.";
  } else {
    feedbackConfirmed.value = '';
  }
});

const loginHandler = async () => {
  try {
    await loginService({
      username: textOrEmail.value,
      password: password.value,
    });
    router.push('/dashboard');
  } catch (error) {
    feedback.value = 'Erreur lors de la connexion. Vérifiez vos identifiants.';
    errorMessage.value = 'Erreur lors de la connexion.';
    console.error(error);
  }
};

const registerHandler = async () => {
  if (
    feedbackUsername.value ||
    feedbackPassword.value ||
    feedbackConfirmed.value ||
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmedPassword.value
  ) {
    errorMessage.value = 'Veuillez corriger les champs invalides.';
    return;
  }

  try {
    await registerService({
      username: name.value,
      email: email.value,
      password: password.value,
    });

    name.value = '';
    email.value = '';
    password.value = '';
    confirmedPassword.value = '';

    toggleMode();
  } catch (error) {
    errorMessage.value = "Erreur lors de l'inscription.";
    console.error(error);
  }
};

const demoAccess = async () => {
  await loginService({
    username: 'Demo',
    password: 'demo',
  });

  router.push('/dashboard');
};
</script>


<style scoped>

.container{
    max-width: 40rem;
    width: 80%;
}

.login,
.register {
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
    background-color: #fefcfb;
    border-radius: 5px;
}

.form-slot {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.form-slot input {
    align-self: center;
    width: 100%;
    padding: 0.5rem 0 0.5rem 0.5rem;
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

.button {
    display: flex;
    justify-content: center;
    color: #fefcfb;
    background-color: #cf7600;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    white-space: nowrap;
    cursor: pointer;
    font-weight: 700;
}

.button:hover {
    background-color: #b96500;
}

.errorFeedback {
    color: red;

}
</style>
