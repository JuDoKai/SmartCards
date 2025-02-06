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

    <!-- Formulaire Manuel -->
    <div v-if="isFormVisible && !isAIFormVisible" class="overlay">
    <div class="modal">
      <form @submit.prevent="newDeck">
        <div class="form-slot">
          <label for="title">Titre du nouveau Deck </label>
          <input type="text" v-model="title" required />
        </div>
        <div class="form-slot">
          <label for="description">Description (recommandé) </label>
          <input type="text" v-model="description" />
        </div>

      
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button type="submit">Valider</button>
        <button type="button" @click="closeForm">Annuler</button>
      </form>
    </div>
  </div>

  <!-- Formulaire IA -->
  <div v-if="isFormVisible && isAIFormVisible" class="overlay">
    <div class="modal">
      <form @submit.prevent="newDeck">
        <div class="form-slot">
          <label for="title">Titre du nouveau Deck </label>
          <input type="text" v-model="title" required />
        </div>
        <div class="form-slot">
          <label for="description">Description (recommandé) </label>
          <input type="text" v-model="description" />
        </div>

        <div class="form-slot">
          <label for="flashcardsNumber">Nombre de flashcards</label>
          <select v-model="flashcardsNumber" name="flashcardsNumber">
            <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="form-slot">
          <label for="flashcardsLevel">Niveau scolaire</label>
          <select v-model="flashcardsLevel" name="flashcardsLevel">
            <option value="Primaire">Primaire</option>
            <option value="Collège">Collège</option>
            <option value="Lycée">Lycée</option>
            <option value="Universitaire">Universitaire</option>
          </select>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button type="submit">Valider</button>
        <button type="button" @click="closeForm">Annuler</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createDeck } from '../../services/apiService';

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
  try {
    const deckData = {
      title: title.value,
      description: description.value,
      number: flashcardsNumber.value,
      level: flashcardsLevel.value,
    };

    const response = await createDeck(props.userId, deckData);
    console.log("Deck créé avec succès :", response);

    emit('deckCreated');

    closeForm();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création du deck.';
    console.error(error);
  }
};


</script>

<style scooped>
h1 {
  margin-left: 1rem;
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
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
    margin-bottom: 15px;
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
.option-title  {
  font-size: 1.25rem;
  height: 5rem;
  width: auto;
  padding: 0 1rem 0 1rem;
  cursor: pointer;
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
</style>
