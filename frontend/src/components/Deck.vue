<template>

    <!--  Affichage Simple -->

    <div v-if="displayMode == 'simple'" class="deck-container" >
      <div class="deck-item">
        <div class="deck-title"><strong>{{ deck.title }}</strong><br /></div>
        <div class="deck-description"><i>{{ deck.description }}</i></div>
        <div class="deck-capacity">
          <p v-if="deckLength == 0">Deck vide</p>
          <p v-else-if="deckLength == 1">1 carte</p>
          <p v-else>{{ deckLength }} cartes</p>
        </div>
        <div class="options">
          <div @click="showCards(deck._id)">
            <div class="eye">
              <img
                src="@/assets/icons/eye.svg"
                title="Afficher les cartes du deck"
                alt="Afficher les cartes du deck"
              />
            </div>
          </div>
          <div @click="openModifyDeckModal(index)" class="pen">
            <img
              src="@/assets/icons/pen.svg"
              title="Modifier le deck"
              alt="Modifier le Deck"
            />
          </div>
          <div @click="openDeleteDeckModal(index)" class="trash">
            <img
              src="@/assets/icons/trash.svg"
              title="Supprimer le deck"
              alt="Supprimer le Deck"
            />
          </div>
        </div>
      </div>
    </div>

    <!--  Affichage Détaillé -->


    <div v-if="displayMode == 'details'" class="deck-container" >
      <div class="deck-item" v-for="(deck, index) in filteredDecks" :key="deck._id">
        <div class="deck-title"><strong>{{ deck.title }}</strong><br /></div>
        <div class="deck-description"><i>{{ deck.description }}</i></div>
        <div class="deck-capacity">
          <p v-if="deck.flashcards.length == 0">Deck vide</p>
          <p v-else-if="deck.flashcards.length == 1">1 carte</p>
          <p v-else>{{ deck.flashcards.length}} cartes</p>
        </div>
        <div class="options">
          <div @click="showCards(deck._id)">
            <div class="eye">
              <img
                src="@/assets/icons/eye.svg"
                title="Afficher les cartes du deck"
                alt="Afficher les cartes du deck"
              />
            </div>
          </div>
          <div @click="openModifyDeckModal(index)" class="pen">
            <img
              src="@/assets/icons/pen.svg"
              title="Modifier le deck"
              alt="Modifier le Deck"
            />
          </div>
          <div @click="openDeleteDeckModal(index)" class="trash">
            <img
              src="@/assets/icons/trash.svg"
              title="Supprimer le deck"
              alt="Supprimer le Deck"
            />
          </div>
        </div>
      </div>
    </div>

</template>

<script setup>

import { ref } from 'vue';

const deckTitle = ref('');
const deckDescription = ref('');
const deckLength = ref('');

</script>

<style scoped>


.deck-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
}

.deck-container p {
  font-size: clamp(0.75rem, 4vw, 1.4rem);
 
}

.deck-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 1rem;
    border: 4px solid black;
    border-radius: 8px;
    background-color: rgb(255, 244, 224);
    font-size: 1.4rem;
}
 
.deck-capacity p{
    margin: 0;
}

.options {
    display: flex;
    gap: 3rem;
    margin-top: 1rem;
}

.options img {
  height: 30px;
  width: 30px;
}

.eye,
.trash,
.pen {
    cursor: pointer;
}


</style>