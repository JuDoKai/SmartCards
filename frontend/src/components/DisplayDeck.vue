<template>
    <h1>Vos Decks</h1>
    <div class="container" v-if="user.decks.length == 0">
      <span class="empty-list">La liste de deck est vide...</span>
    </div>
  
    <div class="deck-container">
      <div class="deck-item" v-for="(deck, index) in user.decks" :key="deck._id">
        <div class="deck-title"><strong>{{ deck.title }}</strong><br /></div>
        <div class="deck-description"><i>{{ deck.description }}</i></div>
        <div class="deck-capacity">
          <p v-if="deck.flashcards.length == 0">Deck vide</p>
          <p v-else-if="deck.flashcards.length == 1">1 carte</p>
          <p v-else>{{ deck.flashcards.length }} cartes</p>
        </div>
        <div class="options">
          <div @click="showCards(deck._id)">
            <div class="eye">
              <img
                src="@/assets/icons/eye.svg"
                title="Afficher les cartes du deck"
                alt="Afficher les cartes du deck"
                width="40"
                height="40"
              />
            </div>
          </div>
          <div @click="openDeleteDeckModal(index)" class="trash">
            <img
              src="@/assets/icons/trash.svg"
              title="Supprimer le deck"
              alt="Supprimer le Deck"
              width="40"
              height="40"
            />
          </div>
        </div>
      </div>
    </div>
  
    <div v-if="isModalOpen" class="overlay">
      <div class="modal">
        <p>Voulez-vous supprimer définitivement le deck <strong>{{ deckTitle }}</strong> ?</p>
        <button type="button" @click="confirmDeleteDeck">Valider</button>
        <button type="button" @click="closeModal">Annuler</button>
      </div>
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import router from "@/router";
import { deleteDeck, updateDeck } from "../../services/apiService";

const isModalOpen = ref(false);
const selectedDeckIndex = ref(null);
const deckTitle = ref("");
const deckDescription = ref("");

const user = defineProps({
  decks: Array,
});

const openDeleteDeckModal = (index) => {
  selectedDeckIndex.value = index;
  deckTitle.value = user.decks[index].title;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDeckIndex.value = null;
  deckTitle.value = "";
};

const confirmDeleteDeck = async () => {
  const deckId = user.decks[selectedDeckIndex.value]._id;
  try {
    await deleteDeck(deckId);
    user.decks.splice(selectedDeckIndex.value, 1);
    closeModal();
    console.log("Deck supprimé :", deckId);
  } catch (error) {
    console.error("Erreur lors de la suppression du deck :", error);
  }
};

const showCards = (id) => {
    router.push(`/dashboard/${id}`);
}
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

.options {
    display: flex;
    gap: 3rem;
    margin-top: 1rem;
}
.eye,
.trash {
    cursor: pointer;
}


</style>