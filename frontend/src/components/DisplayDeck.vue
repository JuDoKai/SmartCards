<template>
    <h1>Vos Decks</h1>
    <div class="container" v-if="user.decks.length == 0">
        <span class="empty-list">La liste de deck est vide...</span> 
    </div>
    
    <div class="deck-container">
        <div class="deck-item" v-for="deck in user.decks" :key="deck.id">
            <div class="deck-title"><strong>{{ deck.title }}</strong><br></div>
            <div class="deck-description"><i>{{ deck.description }}</i></div>
            <div class="deck-capacity">
                 <p v-if="deck.flashcards.length == 0">
                    Deck vide
                </p>
                <p v-else-if="deck.flashcards.length == 1">
                    1 carte
                </p>
                <p v-else>
                    {{ deck.flashcards.length }} cartes
                </p>
            </div>
        </div>
  </div>
    
</template>

<script setup>


const user = defineProps({
    decks: [Object]
});


</script>

<style scoped>

.empty-list {
    font-size: clamp(1rem, 5vw, 3rem);
    opacity: 0.5;
}

.deck-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
}
.deck-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 1rem;
    white-space: nowrap;
    border: 4px solid black;
    border-radius: 8px;
    background-color: rgb(255, 244, 224);
    font-size: 1.4rem;
}
 
.deck-capacity p{
    margin: 0;
}


</style>