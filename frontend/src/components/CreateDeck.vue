<template>
    <button @click="showForm">Créer nouveau deck</button>
  
    <!-- Overlay et Modale -->
    <div v-if="isFormVisible" class="overlay">
      <div class="modal">
        <form @submit.prevent="newDeck">
          <div class="form-slot">
            <label for="title">Titre du nouveau Deck</label>
            <input type="text" v-model="title" required />
          </div>
          <div class="form-slot">
            <label for="description">Description (recommandé)</label>
            <input type="text" v-model="description" />
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

  // Déclarer les props
    const props = defineProps({
        userId: {
        type: String,
        required: true,
  },
});

// Déclarer les événements
const emit = defineEmits(['deckCreated']);
  
// Variables pour le formulaire
const title = ref('');
const description = ref('');
const isFormVisible = ref(false);
const errorMessage = ref(''); // Déclaration de la variable errorMessage

// Afficher la modale
const showForm = () => {
    isFormVisible.value = true;
    errorMessage.value = ''; // Réinitialiser les erreurs
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
</script>

<style scoped>
/* Overlay */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Modale */
.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
}

/* Form slots */
.form-slot {
    margin-bottom: 15px;
}

button {
    margin-right: 10px;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>
