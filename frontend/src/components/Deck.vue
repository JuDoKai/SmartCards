<template>
   <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
            <h3>Question</h3>
            <hr>
            {{ Flashcard }}
            </div>
            <div class="flip-card-back">
            <h3>Réponse</h3>
            <hr>
            {{ Flashcard }}

            </div>
        </div>
    </div>
</template>

<style scoped>



</style>

<script setup>
import { ref } from 'vue';
import Flashcard from './Flashcard.vue';

</script>