<template>
    <div class="flip-card" @click="toggleFlip">
      <div class="flip-card-inner" :class="{ flipped: isFlipped }">
        <div class="flip-card-front">
          <h3>Question</h3>
          {{ question }} 
        </div>
        <div class="flip-card-back">
          <h3>Réponse</h3>
          {{ answer }} 
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  question: String,
  answer: String,
});

const isFlipped = ref(false);

// Fonction pour alterner l'affichage de la question et de la réponse
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value;
};
</script>

  
  <style scoped>
  hr {
    margin: 1rem;
  }
  
  .flip-card {
    background-color: transparent;
    max-width: 1000px;
    width: 80%;
    height: 300px;
    border-radius: 10px;
    perspective: 1000px;
  }
  
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.5s;
    transform-style: preserve-3d;
    border-radius: 10px;
  }
  
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
    box-sizing: border-box;
    border: 2px solid black;
    border-radius: 10px;
  }
  
  .flip-card-front {
    background-color: white;
    color: black;
  }
  
  .flip-card-back {
    background-color: var(--orange3);
    color: white;
    transform: rotateY(180deg);
  }
  
  .flip-card-inner.flipped {
    transform: rotateY(180deg);
  }
  </style>
  
  