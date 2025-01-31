<template>
  <Navbar :name="userName" />
  <div>
    <h1>Flashcards pour le deck :</h1>
  </div>

  <div class="flashcard-container">
    <div v-if="flashcards.length === 0">
      <span class="empty-list">La liste de flashcards est vide...</span>
    </div>
    <div class="carousel">
      <div
        class="flashcard-item"
        v-for="flashcard in flashcards"
        :key="flashcard._id"
      >
      <Flashcard :question="flashcard.question" :answer="flashcard.answer" /> 
     </div>
    </div>
  </div>

</template>



<style scoped>

h1 {
  margin-left: 1rem;
}

.flashcard-container{
 height: 80vh;
 width: auto;
 display: flex;
 justify-content: center;
 align-items: center;
 border: 3px solid black;
}

.empty-list {
  font-size: clamp(1rem, 5vw, 3rem);
  opacity: 0.5;
}

.carousel {
  display: flex;
  gap: 2rem;
}


</style>


<script setup>
import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Navbar from '@/components/Navbar.vue';
import Flashcard from '@/components/Flashcard.vue';
import { onMounted, ref, nextTick } from 'vue';
import { getAllFlashcardsByDeckId } from '../../services/apiService';

const props = defineProps(['id']); // ID du deck passé via la route
const flashcards = ref([]); // Liste des flashcards

onMounted(async () => {
  try {
    // Récupération des flashcards
    const data = await getAllFlashcardsByDeckId(props.id);
    flashcards.value = data;

    // Attendre que le DOM soit mis à jour
    await nextTick();

  } catch (error) {
    console.error('Erreur lors du chargement du deck:', error);
  }
});
</script>
