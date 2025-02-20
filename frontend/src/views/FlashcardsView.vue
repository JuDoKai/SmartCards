<template>

<main>
    <div class="dashboard">
      <Navbar/>
      <div class="display-flashcards">
        <CreateFlashcard
         :userId="decoded.userId" 
         @flashcardCreated="addNewDeck" />
        <DisplayFlashcards :flashcards="userFlashcards"/>
      </div>
    </div>
  </main>

</template>


<script setup>
import Navbar from '@/components/Navbar.vue';
import CreateFlashcards from '@/components/CreateFlashcards.vue';
import { ref, onMounted } from 'vue';

import { jwtDecode } from 'jwt-decode';

import { getUserById, getDecksByUserId } from '../../services/apiService';
import DisplayDeck from '@/components/DisplayDeck.vue';


const props = defineProps(["id"]);
const flashcards = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const data = await getAllFlashcardsByDeckId(props.id);
    flashcards.value = data;
  } catch (error) {
    console.error("Erreur lors du chargement des flashcards:", error);
  }
});

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

.display-flashcards {
  margin: 0 1rem 0 1rem;
}

</style>