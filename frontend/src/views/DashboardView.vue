<template>
  <main>
    <div class="dashboard">
      <Navbar :name="userName"/>
      <div class="display-deck">
        <CreateDeck 
         :userId="decoded.userId" 
         @deckCreated="addNewDeck" />
        <DisplayDeck 
        :decks="userDecks"
        @flashcardDeleted="updateDeckSize"
        />
        
      </div>
    </div>
  </main>

</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import CreateDeck from '@/components/CreateDeck.vue';
import { ref, onMounted } from 'vue';

import { jwtDecode } from 'jwt-decode';

import { getUserById, getDecksByUserId } from '../../services/apiService';
import DisplayDeck from '@/components/DisplayDeck.vue';

const decoded = jwtDecode(localStorage.getItem('authToken'));
const userName = ref('');
const userDecks = ref([]);

onMounted(async () => {
  try {

    const userId = decoded.userId;
    const userData = await getUserById(userId);
   
    userName.value = userData.username;

    // Decks Info (Display Deck)
    userDecks.value = await getDecksByUserId(userId);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  }
});

const addNewDeck = async () => {
  try {
    // Recharge tous les decks depuis l'API
    userDecks.value = await getDecksByUserId(decoded.userId);
    console.log("Decks mis à jour depuis l'API");
  } catch (error) {
    console.error("Erreur lors du rechargement des decks :", error);
  }
};



</script>


<style scoped>

main {
  height: 100%;
  margin: 0;
  padding: 0;
}

.dashboard {
  width: 100%;
}


</style>