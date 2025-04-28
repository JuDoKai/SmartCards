<template>
  <main>
    <div class="dashboard">
      <Navbar :name="userName" />

      <!-- Loader s'affiche pendant le chargement -->
      <Loader v-if="isLoading" />

      <div v-else class="display-flashcards">
        <CreateFlashcards
          :deckId="deckId"
          :deckTitle="deckTitle"
          :deckDescription="deckDescription"
          @flashcardCreated="addNewFlashcard"
          @flashcardDeleted="flashcardDeleted"
        />
        
        <DisplayFlashcards 
          :flashcards="flashcards"
          :deckTitle="deckTitle"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import CreateFlashcards from '@/components/CreateFlashcards.vue';
import DisplayFlashcards from '@/components/DisplayFlashcards.vue';
import Loader from '@/components/Loader.vue';
import { ref, onMounted } from 'vue';
import { getAllFlashcardsByDeckId, getDeckByDeckId } from '../../services/apiService';

const props = defineProps(["id"]);
const deckId = props["id"];
const flashcards = ref([]);
const deckTitle = ref('');
const deckDescription = ref('');
const userName = ref('');
const isLoading = ref(true); // État du chargement

onMounted(async () => {
  try {
    const data = await getAllFlashcardsByDeckId(deckId);
    flashcards.value = data;
    
    const data2 = await getDeckByDeckId(deckId);
    userName.value = data2.user.username;
    deckTitle.value = data2.title;
    deckDescription.value = data2.description;
  } catch (error) {
    console.error("Erreur lors du chargement des flashcards:", error);
  } finally {
    isLoading.value = false; // Fin du chargement
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