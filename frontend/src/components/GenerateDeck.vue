<template>
<button @click="showForm" class="new-deck">Génerer par IA 
    <img
        src="@/assets/icons/robot.svg"
        title="IA"
        alt="IA"
        width="50"
        height="50"
        />
</button>

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

<style>
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

.new-deck {
  font-size: 1.25rem;
  padding: 20px;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>
