<script setup>
import Navbar from '@/components/Navbar.vue';
import CreateDeck from '@/components/CreateDeck.vue';
import GenerateDeck from '@/components/GenerateDeck.vue';
import { ref, onMounted } from 'vue';

import { jwtDecode } from 'jwt-decode';

import { getUserById, getDecksByUserId } from '../../services/apiService';
import DisplayDeck from '@/components/DisplayDeck.vue';

const decoded = jwtDecode(localStorage.getItem('authToken'));
const userName = ref('');
const userDecks = ref([]);

onMounted(async () => {
  try {

    // Users Info
    const userId = decoded.userId;
    const userData = await getUserById(userId);
   
    userName.value = userData.username;

    // Decks Info (Display Deck)
    userDecks.value = await getDecksByUserId(userId);     

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  }
});

const addNewDeck = (newDeck) => {
  userDecks.value.push(newDeck);
};

</script>



<template>
  <main>
    <div class="dashboard">
      <Navbar :name="userName"/>
      <div class="display-deck">
        <DisplayDeck :decks="userDecks"/>
        <CreateDeck 
        :userId="decoded.userId" 
        @deckCreated="addNewDeck" />
        
      </div>
    </div>
  </main>

</template>


<style scoped>

main {
  height: 100%;
  margin: 0;
  padding: 0;
}

.dashboard {
  width: 100%;
}

.display-deck {
  margin: 0 1rem 0 1rem;
}


</style>