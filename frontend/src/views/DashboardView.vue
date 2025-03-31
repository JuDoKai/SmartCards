<template>
  <main>
    <div class="dashboard">
      <Navbar :name="userName"/>
      <div class="display-deck">
        <CreateDeck 
          :userId="decoded.userId" 
          @deckCreated="addNewDeck" 
        />
        <DisplayDeck 
          :decks="userDecks"
          @deckUpdated="updateDeck"
          @deckDeleted="removeDeck"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { getUserById, getDecksByUserId } from '../../services/apiService';
import Navbar from '@/components/Navbar.vue';
import CreateDeck from '@/components/CreateDeck.vue';
import DisplayDeck from '@/components/DisplayDeck.vue';

const decoded = jwtDecode(localStorage.getItem('authToken'));
const userName = ref('');
const userDecks = ref([]);

onMounted(async () => {
  try {
    const userId = decoded.userId;
    const userData = await getUserById(userId);
    userName.value = userData.username;
    userDecks.value = await getDecksByUserId(userId);
  } catch (error) {
    console.error("Erreur lors de la récupération des decks :", error);
  }
});

const addNewDeck = (newDeck) => {
  userDecks.value.push(newDeck);
};

const updateDeck = (updatedDeck) => {
  const index = userDecks.value.findIndex(deck => deck._id === updatedDeck._id);
  if (index !== -1) {
    userDecks.value[index] = updatedDeck;
  }
};

const removeDeck = (deckId) => {
  userDecks.value = userDecks.value.filter(deck => deck._id !== deckId);
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
