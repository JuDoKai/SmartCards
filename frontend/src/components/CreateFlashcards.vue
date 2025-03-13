<template>
    <div class="container">
      <h1>Création de Flashcard</h1>
      <div class="flashcards-options">
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
        <form @submit.prevent="newFlashcard">
          <div class="form-slot">
            <strong><p>Création de Flashcard (Manuellement)</p></strong>
            <label for="question">Question </label>
            <input type="text" v-model="question" required />
          </div>
          <div class="form-slot">
            <label for="description">Réponse </label>
            <input type="text" v-model="answer" />
          </div>
  
        
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <button type="submit">Valider</button>
          <button type="button" @click="closeForm">Annuler</button>
        </form>
    </div>


  
    <!-- Formulaire IA -->
    <div v-if="isFormVisible && isAIFormVisible && !isLoading" class="modal">
        <form @submit.prevent="newFlashcardIA">  
          <div class="form-slot">
            <strong><p>Création de Flashcard (IA)</p></strong>
            <label for="flashcardsNumber">Nombre de flashcards </label>
            <select v-model="flashcardsNumber" name="flashcardsNumber">
              <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
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
          <button type="submit">Valider</button>
          <button type="button" @click="closeForm">Annuler</button>
        </form>
      </div>
  </div>

  </template>

<script setup>
import { ref } from 'vue';
import { createFlashcard, generateFlashcard } from '../../services/apiService';
import Loader from './Loader.vue';


const props = defineProps({
  deckId: String,
  deckTitle: String,
  deckDescription: String
});

const emit = defineEmits(['flashcardCreated']);

const question = ref('');
const answer = ref('');
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
  question.value = '';
  answer.value = '';
};

const newFlashcard = async () => {
  isLoading.value = true;
  try {
    const flashcardData = {
      question: question.value,
      answer: answer.value,
    };

    const response = await createFlashcard(props.deckId, flashcardData);
    console.log("Flashcard créé avec succès :", response);

    emit('flashcardCreated');

    closeForm();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création de la flashcard.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};


const newFlashcardIA = async () => {
  isLoading.value = true;
  try {
    const flashcardData = {
      number: flashcardsNumber.value,
      level: flashcardsLevel.value,
    };

    const response = await generateFlashcard(props.deckId, flashcardData);
    console.log("Flashcards générer avec succès :", response);

    emit('flashcardCreated');

    closeForm();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la génération des flashcards.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
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

.flashcards-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.new-flashcards {
  font-size: 1.25rem;
  padding: 20px;
}
.option-title  {
  font-size: 1.4rem;
  height: 5rem;
  width: auto;
  padding: 0 1rem 0 1rem;
  cursor: pointer;
  background-color: rgb(255, 244, 224);
  border: 4px solid black;
  border-radius: 8px;
}


.container :nth-child(2)  {
  display: flex;
  gap: 8px;
  align-items: center;  
}

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

.error {
    color: red;
    margin-top: 10px;
}
</style>