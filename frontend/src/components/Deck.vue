<template>
    <div class="deck-display">
        <p>Deck</p>
    </div>
</template>

<style scoped>
.deck-display {
    height: 100px;
    width: 100px;
    background-color: red;
}
</style>

<script setup>
import { ref } from 'vue';

const deck = () => ({
    id: Date.now(),
    title: '',
    subtitle: ''
})

const deckStorage = () => {[]}

</script>