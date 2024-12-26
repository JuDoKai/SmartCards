<script setup>
import Navbar from '@/components/Navbar.vue';
import Filter from '@/components/Filter.vue';
import { ref, onMounted } from 'vue';

import { jwtDecode } from 'jwt-decode';

const deck = ref([]);
import { getUserById, getDecksByUserId } from '../../services/apiService';

const decoded = jwtDecode(localStorage.getItem('authToken'));
const userName = ref('');
const decks = ref([]);

onMounted(async () => {
  try {

    // Users Info
    const userId = decoded.userId;
    const userData = await getUserById(userId);
    userName.value = userData.username;

    // Decks Info (Display Deck)
    decks.value = await getDecksByUserId(userId);

    console.log(decks.value);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  }
});


</script>



<template>
    <div class="dashboard">
      <Navbar :name="userName"/>
      <main>
        <div class="main-content" v-if="deck.length == 0">
         <span class="empty-list">La liste de deck est vide...</span>
        </div>
       
      </main>
     
    </div>
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


.empty-list {
  font-size: clamp(1rem, 5vw, 3rem);
  opacity: 0.5;
}


.new-deck:hover {
  background-color: #464646;
}



</style>