<script setup>
import Navbar from '@/components/Navbar.vue';
import Filter from '@/components/Filter.vue';
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
      <DisplayDeck :decks="userDecks"/>
      <CreateDeck :userId="decoded.userId" @deckCreated="addNewDeck"/>
    </div>
  </main>

</template>


<style scoped>

.dashboard {
  margin: 0;
  padding: 0;
  height: 100vh;
}



.main-content {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}



.new-deck:hover {
  background-color: #464646;
}



</style>