<template>
  <div class="container">
    <h1>Création de nouveau deck</h1>
    <div class="deck-options">
      <button @click="showForm('manual')" class="option-title">Manuellement</button>
      <button @click="showForm('ai')" class="option-title">Générer par IA 
        <img
          src="@/assets/icons/robot.svg"
          title="IA"
          alt="IA"
          width="50"
          height="50"
        />
      </button>
    </div>
  </div>

  <div v-if="isLoading || isFormVisible" class="overlay">
    
    <div v-if="isLoading" class="loader-container">
      <p>Chargement en cours...</p>
      <Loader/>
    </div>

    <!-- Formulaire Manuel -->
    <div v-if="isFormVisible && !isAIFormVisible && !isLoading" class="modal">
      <form @submit.prevent="newDeck">
        <div class="form-slot">
          <strong><p>Création du nouveau deck</p></strong>
          <label for="title">Titre du nouveau Deck </label>
          <input type="text" v-model="title" required />
        </div>
        <div class="form-slot">
          <label for="description">Description (recommandé) </label>
          <input type="text" v-model="description" />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <div class="buttons">
          <button type="submit">Valider</button>
          <button type="button" @click="closeForm">Annuler</button>
        </div>
       
      </form>
    </div>

    <!-- Formulaire IA -->
    <div v-if="isFormVisible && isAIFormVisible && !isLoading" class="modal">
      <form @submit.prevent="newDeckIA">
        <div class="form-slot">
          <strong><p>Génération du nouveau deck</p></strong>
          <label for="title">Titre du nouveau Deck </label>
          <input type="text" v-model="title" required />
        </div>
        <div class="form-slot">
          <label for="description">Description (recommandé) </label>
          <input type="text" v-model="description" />
        </div>

        <div class="form-slot">
          <label for="flashcardsNumber">Nombre de flashcards </label>
          <select v-model="flashcardsNumber" name="flashcardsNumber">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="form-slot">
          <label for="flashcardsLevel">Niveau scolaire </label>
          <select v-model="flashcardsLevel" name="flashcardsLevel">
            <option value="Primaire">Primaire</option>
            <option value="Collège">Collège</option>
            <option value="Lycée">Lycée</option>
            <option value="Universitaire">Universitaire</option>
          </select>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <div class="buttons">
          <button type="submit">Valider</button>
          <button type="button" @click="closeForm">Annuler</button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createDeck, getDecksByUserId } from '../../services/apiService';
import Loader from './Loader.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['deckCreated']);

const title = ref('');
const description = ref('');
const flashcardsNumber = ref(1);
const flashcardsLevel = ref('Primaire');
const isFormVisible = ref(false);
const isAIFormVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const showForm = (mode) => {
  isFormVisible.value = true;
  isAIFormVisible.value = mode === 'ai';
  errorMessage.value = '';
};

const closeForm = () => {
  isFormVisible.value = false;
  isAIFormVisible.value = false;
  title.value = '';
  description.value = '';
};

const newDeck = async () => {
  isLoading.value = true;
  try {
    const deckData = {
      title: title.value,
      description: description.value,
    };

    const response = await createDeck(props.userId, deckData);
    console.log("Deck créé avec succès :", response);

    emit('deckCreated', response);

    closeForm(); 
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création du deck.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const newDeckIA = async () => {
  isLoading.value = true;
  try {
    const deckData = {
      title: title.value,
      description: description.value,
      number: flashcardsNumber.value,
      level: flashcardsLevel.value,
    };

    console.log("Données envoyées au backend :", deckData);

    const response = await createDeck(props.userId, deckData);
    console.log("Deck créé avec succès :", response.deck);

    const updatedDeck = await getDecksByUserId(response.deck._id);


    emit('deckCreated', updatedDeck);

    

    closeForm();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création du deck.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};


</script>

<style scoped>

h1 {
  margin-left: 1rem;
  font-size: clamp(1.25rem, 7vw, 2rem);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
}


.form-slot {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    margin-bottom: 10px;
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

.deck-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.new-deck {
  font-size: 1.25rem;
  padding: 20px;
}

.option-title {
  font-size: clamp(0.5rem, 4vw, 1.4rem);
  height: 5rem;
  width: auto;
  padding: 0 1rem 0 1rem;
  cursor: pointer;
  background-color: rgb(255, 244, 224);
  border: 4px solid black;
  border-radius: 8px;
}

.option-title:active {
  background-color: rgb(247, 229, 195);
}


.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.buttons button {
    color: #fefcfb;
    background-color: #cf7600;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-weight: 700;
    border: none;
}

.buttons button:hover {
    background-color: #b96500;
}

.container :nth-child(2)  {
  display: flex;
  gap: 8px;
  align-items: center;  
}

.error {
    color: red;
    margin-top: 10px;
}

/* Loader */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
}

.loader {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 5px solid black;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
