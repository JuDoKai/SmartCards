<template>

<main>
    <div class="dashboard">
      <Navbar/>
      <div class="display-flashcards">

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
import { ref, onMounted } from 'vue';

import { getUserById, getDecksByUserId, getAllFlashcardsByDeckId, getDeckByDeckId } from '../../services/apiService';

const props = defineProps(["id"]);
const deckId = props["id"];
const flashcards = ref([]);
const deckTitle = ref('');
const deckDescription = ref('');


onMounted(async () => {
  try {
    const data = await getAllFlashcardsByDeckId(deckId);
    flashcards.value = data;
    
    const data2 = await getDeckByDeckId(deckId);

    deckTitle.value = data2.title;
    deckDescription.value = data2.description;

  } catch (error) {
    console.error("Erreur lors du chargement des flashcards:", error);
  }
});


const addNewFlashcard = async () => {
  try {
    // Recharge tous les flashcards du deck depuis l'API
    flashcards.value = await getAllFlashcardsByDeckId(deckId);
  } catch (error) {
    console.error("Erreur lors du rechargement des flashcards :", error);
  }
};



const flashcardDeleted = async () => {
  try {
    // Recharge tous les flashcards du deck depuis l'API
    flashcards.value = await  getAllFlashcardsByDeckId(deckId);
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

.display-flashcards {
  margin: 0 1rem 0 1rem;
}

</style>