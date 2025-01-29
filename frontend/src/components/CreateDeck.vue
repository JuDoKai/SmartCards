<template>
  <div class="container">
    <h1>Création de nouveau deck</h1>
    <div class="deck-options">
    <button @click="showForm" class="option-title">Manuellement</button>
    <button @click="showForm" class="option-title">Générer  par IA 
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
  
   
    <!-- Manuel   -->
    <div v-if="isFormVisible" class="overlay">
      <div class="modal">
        <form @submit.prevent="newDeck">
          <div class="form-slot">
            <label for="title">Titre du nouveau Deck </label>
            <input type="text" v-model.trim="title" required />
          </div>
          <div class="form-slot">
            <label for="description">Description (recommandé) </label>
            <input type="text" v-model.trim="description" />
          </div>
        
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <button type="submit">Valider</button>
          <button type="button" @click="closeForm">Annuler</button>
        </form>
      </div>
    </div>

    <!-- IA   -->
    <div v-if="isFormVisible" class="overlay">
      <div class="modal">
        <form @submit.prevent="newDeckIA">
          <div class="form-slot">
            <label for="title">Titre du nouveau Deck </label>
            <input type="text" v-model.trim="title" required />
          </div>
          <div class="form-slot">
            <label for="description">Description (recommandé) </label>
            <input type="text" v-model.trim="description" />
          </div>

          <div class="form-slot">
            <label for="description">Nombres de flashcards </label>
            <select name="flashcardsNumber">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
          </div>

          <div class="form-slot">
            <label for="description">Niveau scolaire </label>
              <select name="flashcardsLevel">
              <option value="1">Primaire</option>
              <option value="2">Collège</option>
              <option value="3">Lycée</option>
              <option value="4">Universitaire</option>
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
const flashcardsLevel = ref(1);
const isFormVisible = ref(false);
const errorMessage = ref('');
const generatedFlashcards = ref([]); // Pour stocker les flashcards générées

const showForm = () => {
    isFormVisible.value = true;
    errorMessage.value = '';
};
  
// Fermer la modale
const closeForm = () => {
    isFormVisible.value = false;
    title.value = '';
    description.value = '';
};
  
// Créer un nouveau deck
const newDeck = async () => {
    try {
        const deckData = {
            title: title.value,
            description: description.value
        };
    const response = await createDeck(props.userId, deckData);

    emit('deckCreated', response);
        
        closeForm(); // Fermer la modale après succès
    } catch (error) {
        errorMessage.value = 'Erreur lors de la création du deck. Veuillez réessayer.';
        console.error(error);
    }
};

const newDeckIA = async () => {
    try {
        const deckData = {
            title: title.value,
            description: description.value
        };
    const response = await createDeck(props.userId, deckData);

    emit('deckCreated', response);
        
        closeForm(); 
    } catch (error) {
        errorMessage.value = 'Erreur lors de la création du deck. Veuillez réessayer.';
        console.error(error);
    }
};


</script>

<style>
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
