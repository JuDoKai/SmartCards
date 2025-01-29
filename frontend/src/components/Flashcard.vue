<template>
    <div class="flip-card">
         <div class="flip-card-inner">
            <div class="flip-card-front">
             <h3>Question</h3>
             <hr>
             {{ flashcard.question }}
             </div>
            <div class="flip-card-back">
             <h3>Réponse</h3>
             <hr>
             {{ flashcard.reponse }}
            </div>
        </div>
    </div>
</template>
 
<style scoped>

hr {
    margin: 1rem  1rem;
}
/*  
.flip-card {
    background-color: transparent;
    width: 50rem;
    height: 20rem;
    border-radius: 20px;
    
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.5s;
    transform-style: preserve-3d;
    border-radius: 200px;

}

/*
.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}


.flip-card-front, 
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; 
    backface-visibility: hidden;
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

*/

</style>
 
<script setup>
import { ref } from 'vue';

const flashcard = defineProps({
    question: String,
    reponse: String
});
 
</script>